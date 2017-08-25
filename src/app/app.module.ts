import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';
import { HttpModule }           from '@angular/http';
import { MomentModule }         from 'angular2-moment';
import { ChartsModule }         from 'ng2-charts';

import { AppComponent }         from './app.component';
import { CButton }              from './cbutton/cbutton';
import { BoxComponent }         from './box/box.component';
import { ChartComponent }       from './chart/chart.component';
import { WebsocketService }     from './websocket.service';
import { ArduinoComService }    from './arduino.com.service';

@NgModule({
    declarations: [
        AppComponent,
        BoxComponent,
        ChartComponent,
        CButton,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MomentModule,
        ChartsModule,
    ],
    providers: [
        WebsocketService, ArduinoComService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
