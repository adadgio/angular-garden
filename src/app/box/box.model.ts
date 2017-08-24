/**
 * Box data model for corresponding component.
 */
export interface BoxModelInterface {
    label: string;
    value: string|number;
    unit: string;
};

export class BoxModel {
    label: string = null;
    value: string|number = null;
    unit: string = null;

    constructor(data: BoxModelInterface)
    {
        this.label = data.label;
        this.value = data.value;
        this.unit = data.unit;
    }

    setValue(value: string|number)
    {
        this.value = value;
        return this;
    }
}
