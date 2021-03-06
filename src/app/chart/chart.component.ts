import * as moment from 'moment';
import { Http }                 from '@angular/http';
import { Component, OnInit }    from '@angular/core';
import { ViewChild }            from '@angular/core';
import { Input }                from '@angular/core';
import { BaseChartDirective }   from 'ng2-charts/ng2-charts';
import { environment, $conf }   from '../../environments/environment';
import { LogParser }            from './log.parser';

const CHART_POINT_EVERY_X_MIN = 3;

@Component({
    selector: 'chart-component',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    @Input('name') name: string = null;
    @Input('view') view: string = 'hours';

    // @docs-A01
    // the logs contains all sensor data such as
    // Wed Aug 23 2017 06:50:02 GMT+0000 (UTC)| 563;50;24
    // the 563;50;24 is soil humidity, air humidity and air temperature
    // by convention (also named "sh", "ah" and "at" in arduino)
    @Input('showValsOf') showValsOf: string = null;

    // history hold previous data when user opened the browser
    // so the chart does not redraw every time (prevent setting a whole new chartData(s)...)
    private _dataHistory: any = { "sh": {}, "ah": {}, "at": {} };
    private _showValsOfMapIndex: any = { "sh": 0, "ah": 1, "at": 2 };

    chartLabels: Array<any> = [];

    chartData: Array<any> = [
        {
            data: [],
            label: null,
        }
    ];

    chartColors: Array<any> = [
        {
            pointRadius: 0,
            pointBorderWidth: 0,
            pointBorderColor: '#123752',
            pointBackgroundColor: '#123752',
            borderColor: '#123752',
            backgroundColor: 'rgba(112, 142, 164, 0.7)',
            fill: true,
        }
    ];

    chartOptions: any = {
        legend: {
            labels: {
                fontColor: '#fff',
            }
        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    display: true,
                },
                ticks: {
                  fontColor: '#fff',
                },
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    display: true,
                },
                ticks: {
                    // min: -10,
                    // max: 40,
                    fontColor: '#fff',
                    callback: (originalValue) => {
                        if (this.showValsOf === 'at') {
                            return `${originalValue}°`;
                        } else if (this.showValsOf === 'ah') {
                            return `${originalValue}%`;
                        } else {
                            return originalValue;
                        }
                    }
                },
            }],
        }
    };

    constructor(private http: Http)
    {

    }

    ngOnInit()
    {
        this.chartData[0].label = this.name;

        // bug/ng2-chart or angular, its not updated here
        // but strangely works from ngOnInit (and not ngAfterViewInit !!)... and also
        // ng2chart library update/refresh policy REALLY sucks, so... there you are

        // min and max values differ if mode is "sh", "ah" or "at"
        // configure different axis scales and other colors
        // depending on the graph we would like to show
        switch(this.showValsOf) {
            case 'sh':
                // soil humidity is a value between 100, theoritically 0 and 1024 (with 5v, othervise 600 or 800 i think)
                this.chartOptions.scales.yAxes[0].ticks.min = 0;
                this.chartOptions.scales.yAxes[0].ticks.max = 1050;
                this.chartOptions.scales.yAxes[0].ticks.maxTicksLimit = 5;
                this.chartOptions.scales.yAxes[0].ticks.stepSize = ((1050-0)/5); // 210
            break;
            case 'ah':
                // air humidity is in percentages
                this.chartOptions.scales.yAxes[0].ticks.min = 0;
                this.chartOptions.scales.yAxes[0].ticks.max = 120;
                this.chartOptions.scales.yAxes[0].ticks.maxTicksLimit = 8;
                this.chartOptions.scales.yAxes[0].ticks.stepSize = 20;
            break;
            case 'at':
                // air humidity is in percentages
                this.chartOptions.scales.yAxes[0].ticks.min = -20;
                this.chartOptions.scales.yAxes[0].ticks.max = 60;
                this.chartColors[0].borderColor = '#da3b15';
                this.chartColors[0].fill = false;
                this.chartOptions.scales.yAxes[0].ticks.maxTicksLimit = 8;
                this.chartOptions.scales.yAxes[0].ticks.stepSize = 10;
            break;
            default:
                // noooothing to do here!
            break;
        }

        this.refresh();
    }

    ngAfterViewInit()
    {

    }

    changeView(viewMode: string)
    {
        this.view = viewMode;
        this.refresh(true);
    }

    refresh(reset: boolean = false)
    {
        if (true === reset) {
            this.chartData[0].data = [];
            this.chartLabels = [];
            this._dataHistory = { "sh": {}, "ah": {}, "at": {} };
        }

        const params: any = [
            { group: this.view }, //`group=day`,
            { fields: 'id,created_at' },
        ];

        const paramsStr = params.map(a => {
            const key = Object.keys(a)[0];
            const val = a[key];
            return `${key}=${val}`;
        }).join('&');

        const url = $conf.NODERED.HTTP_ENDPOINT();
        const req = this.http.get(`${url}/api/garden/logs?${paramsStr}`).toPromise();

        req.then((res: any) => {
            let parser = new LogParser(JSON.parse(res._body));

            parser.parseMap((row: any) => {
                const uuid = row.label;

                if (typeof(this._dataHistory[this.showValsOf][uuid]) === 'undefined') {
                    this.chartData[0].data.push(row[this.showValsOf]);
                    this.chartLabels.push(row.label);
                    this._dataHistory[this.showValsOf][uuid] = true;
                }

            }, { group: params[0].group });

            if (this.showValsOf === "sh") {
                // console.log(this.chartLabels);
                // console.log(this.chartData[0].data);
            }

            this.chart.chart.update();

        }).catch(e => {
            console.log(e);
        });
    }
}
