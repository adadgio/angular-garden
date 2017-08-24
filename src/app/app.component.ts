declare var document: any;
import { Component, OnInit }        from '@angular/core';
import { QueryList, ViewChildren }  from '@angular/core';
import { environment, $conf }       from '../environments/environment';

import { WebsocketService }         from './websocket.service';
import { ArduinoComService }        from './arduino.com.service';
import { ChartComponent }           from './chart/chart.component';
import { BoxModel }                 from './box/box.model';
import { QueryParams }              from './query.params';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChildren(ChartComponent) chartComponents: QueryList<ChartComponent>;

    servoAngle: number = 85; // 85 seems a good 90% value
    servoCmdDisabled: boolean = false;

    errorString: string = null;
    successString: string = null;

    boxes: Array<BoxModel> = [];

    chartsView: string;

    constructor(
        private socket: WebsocketService,
        private arduino: ArduinoComService,
    )
    {
        this.boxes = [
            new BoxModel({
                label: 'Soil moisture',
                value: 0,
                unit: '&#8486;',
            }),
            new BoxModel({
                label: 'Air humidity',
                value: 0,
                unit: '%',
            }),
            new BoxModel({
                label: 'Temperature',
                value: 0,
                unit: 'c°',
            })
        ];

        const url = $conf.NODERED.SOCKET_ENDPOINT();
        const socket01 = socket.connect(`${url}/ws/garden`);

        socket01.subscribe((e: MessageEvent) => {
            const data = JSON.parse(e.data);

            // refresh boxes with current units measurement
            this.boxes[0].setValue(data.sh);
            this.boxes[1].setValue(data.ah);
            this.boxes[2].setValue(data.at);

            this.boxes = this.boxes;

            // refresh all logs history charts
            this.chartComponents.forEach((component, index) => {
                component.refresh();
            });
        });

        this.chartsView = QueryParams.getByName('view', 'minutes');

        // test online arduino status
        this.arduinoStatus();
    }

    ngOnInit()
    {

    }

    ngAfterViewInit()
    {

    }

    trackByFn(index: number, item: any)
    {

    }

    sendServoAnyCommand()
    {
        const position = this.servoAngle;
        this.sendServoCommand(position);
    }

    /**
     * Send the arduino a rest http command to rotate the servo.
     * @return void
     */
    sendServoCommand(value: number)
    {
        this.servoCmdDisabled = true;

        this.arduino.servoSetAngle(value).then(d => {
            this.servoCmdDisabled = false;
        }).catch(e => {
            this.servoCmdDisabled = false;
            this.error(`Arduino unreachable${(e.message) ? ': ' + e.message : ''}`);
        });
    }

    /**
     * Send the arduino a rest http command to know if its online
     * @return void
     */
    arduinoStatus()
    {
        this.arduino.onlineStatus().then(d => {
            this.success(`Arduino is online`);
        }).catch(e => {
            this.error(`Arduino unreachable${(e.message) ? ': ' + e.message : ''}`);
        });
    }

    /**
     * Show nice error message.
     * @todo Make message fade slowly after a few seconds.
     */
    error(message: string)
    {
        const element = document.getElementById('status');

        this.successString = null;
        this.errorString = message;

        element.classList.add('visible');
        element.classList.remove('hidden');

        setTimeout(() => {
            element.classList.add('hidden');
            element.classList.remove('visible');
        }, 1500);
    }

    /**
     * Show nice error message.
     * @todo Make message fade slowly after a few seconds.
     */
    success(message: string = null)
    {
        const element = document.getElementById('status');

        this.errorString = null;
        this.successString = message;

        element.classList.add('visible');
        element.classList.remove('hidden');

        setTimeout(() => {
            element.classList.add('hidden');
            element.classList.remove('visible');
        }, 1500);
    }
}
