import { Injectable }           from '@angular/core';
import { Http }                 from '@angular/http';
import { environment, $conf }   from '../environments/environment';

const HTTP_TIMEOUT = 3500;

@Injectable()
export class ArduinoComService {

    constructor(private http: Http)
    {

    }

    onlineStatus(): Promise<any>
    {
        const url = $conf.ARDUINO.HTTP_ENDPOINT();

        const req = this.http.get(`${url}/status`).toPromise();

        return new Promise((resolve, reject) => {
            req.then((res: any) => {
                resolve(res._body);
            }).catch(e => {
                reject(e);
            });
        });
    }

    /**
     * Send the arduino a rest http command to rotate the servo.
     * @return void
     */
    servoSetAngle(value: number): Promise<any>
    {
        const url = $conf.ARDUINO.HTTP_ENDPOINT();

        const req = this.http.get(`${url}/servo?params=${value}`).toPromise();

        return new Promise((resolve, reject) => {
            req.then((res: any) => {
                console.log(res._body);
                resolve(res._body);
            }).catch(e => {
                reject(e);
            });
        });
    }

}
