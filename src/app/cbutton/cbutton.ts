declare var window: any;
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

type Degrees180 = {};

@Component({
    selector: 'cbutton',
    templateUrl: './cbutton.html',
    styleUrls: ['./cbutton.scss']
})
export class CButton implements OnInit {
    @ViewChild('circle') circle;
    @ViewChild('maskFull') maskFull;
    @ViewChild('fill1') fill1;
    @ViewChild('maskHalf') maskHalf;
    @ViewChild('fill2') fill2;
    @ViewChild('fillFix') fillFix;

    constructor()
    {

    }

    ngOnInit()
    {
        // previously: the #circle element was undefined
        // currently: the #circle element is defined and usable
        //console.log(this.circle.nativeElement);

    }

    ngAfterViewInit()
    {
        // previously: the #circle element was defined and usable
        // currently: the #circle element is undefined
        //console.log(this.circle.nativeElement);
        this.animate(180);
    }

    animate(rotation: number)
    {
        const circle: HTMLElement = this.circle.nativeElement;
        const maskFull: HTMLElement = this.maskFull.nativeElement;
        const fill1: HTMLElement = this.fill1.nativeElement;
        const maskHalf: HTMLElement = this.maskHalf.nativeElement;
        const fill2: HTMLElement = this.fill2.nativeElement;
        const fillFix: HTMLElement = this.fillFix.nativeElement;


        var transform_styles = ['-webkit-transform', '-ms-transform', 'transform'];

        const cssRotation = `rotate(${rotation}deg)`;

        this.setTransformStyle(fill1, cssRotation);
        this.setTransformStyle(maskFull, cssRotation);
        this.setTransformStyle(fillFix, cssRotation);

        window.randomize = () => {
            // var fill_rotation = rotation;
            // var fix_rotation = rotation * 2;

            //for (let i in transform_styles) {
                // const fillRotationCSS = 'rotate(' + fill_rotation + 'deg)';
                // const fixRotationCSS = 'rotate(' + fix_rotation + 'deg)';
                //
                // fill1.style.webkitTransform = fillRotationCSS;
                // fill1.style.transform = fillRotationCSS;
                //
                // maskFull.style.webkitTransform = fillRotationCSS;
                // maskFull.style.transform = fillRotationCSS;
                //
                // fillFix.style.webkitTransform = fillRotationCSS; // fixRotationCSS;
                // fillFix.style.transform = fillRotationCSS; // fixRotationCSS;
            //}
        }

        setTimeout(window.randomize, 200);
    }

    ngOnChanges()
    {

    }

    setTransformStyle(element: HTMLElement, cssStyle: string)
    {
        element.style.transform = cssStyle;
        element.style.webkitTransform = cssStyle;
        element.style['msTransform'] = cssStyle;
        element.style['MozTransform'] = cssStyle;
    }
}
