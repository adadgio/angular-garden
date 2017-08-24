import { Http }                 from '@angular/http';
import { Component, OnInit }    from '@angular/core';
import { Input }                from '@angular/core';
import { BoxModel }             from './box.model';

@Component({
    selector: 'box-component',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {
    @Input('model') model: BoxModel = null;
    
    constructor()
    {

    }

    ngOnInit()
    {

    }

    ngOnChanges()
    {

    }
}
