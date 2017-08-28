import * as moment from 'moment';

/**
 * Logs parser and formatter for charts
 */
export class LogParser {

    private data: any = [];
    private _once = true;

    private ticksFormats = {
        days: "Do MMM",
        hours: "HH:mm",
        minutes: "HH:mm",
    };

    constructor(data: any)
    {
        this.data = data;
    }

    parseMap(fn: Function, opts: any = { group: 'days' })
    {
        for (let i in this.data) {
            const row = this.data[i];
            const time = moment.utc(row.created_at);

            row.label = time.local().format(this.ticksFormats[opts.group]);

            fn(row);
        }
    }
}
