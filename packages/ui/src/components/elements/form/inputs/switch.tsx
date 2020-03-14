
import { Component, h, Prop, Event, EventEmitter, Watch, State } from "@stencil/core";
import { mergeClass } from "../../../../libs/utils";

@Component({
    tag: 'gel-input-switch',
    //styleUrl: 'switch.scss',
})
export class GELInputSwitch
{
    @Event() inputUpdate: EventEmitter<{formKey: string, value: any}>;

    @Prop() formKey: string;
    @Prop({mutable: true}) label?: string;
    @Prop() value?: boolean;
    @Prop() disabled?: boolean;
    @Prop() inputClass: string|Record<string, boolean> = "";

    @State() _value;
    inputEl: HTMLInputElement;

    @Watch("value")
    componentWillLoad()
    {
        this._value = this.value;
    }

    componentDidLoad()
    {
        this.inputUpdate.emit({
            formKey: this.formKey,
            value: this._value
        });
    }

    updateContent(newVal: boolean)
    {
        if (this.disabled) return;
        this._value = newVal;
        this.inputUpdate.emit({
            formKey: this.formKey,
            value: this._value
        });
    }

    render()
    {
        return (
            <div class="field is-horizontal">
                { this.label === undefined ? "" :
                    <div class="field-label is-normal">
                        <label class="label">{this.label.toLocaleUpperCase()}</label>
                    </div>
                }
                
                <div class="field-body">
                    <div class="field">
                        <p class="control is-expanded">
                            <input 
                                ref={el => this.inputEl = el}
                                class={mergeClass("switch", this.inputClass)}
                                type="checkbox" 
                                checked={this._value}  
                            />
                            <label 
                                onClick={() => this.updateContent(!this._value)} 
                                style={{top: "10px"}}
                            ></label>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
