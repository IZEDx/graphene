import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { mergeClass } from "../../../../libs/utils";

@Component({
    tag: 'gel-input-select',
    //styleUrl: 'view-list.scss',
})
export class GELInputSelect
{
    @Event() inputUpdate: EventEmitter<{formKey: string, value: any}>;

    @Prop() options: {name: string, value: string}[];

    @Prop() formKey: string;
    @Prop() label?: string;
    @Prop() value?: string;
    @Prop() disabled?: boolean;
    @Prop() selectClass: string|Record<string, boolean> = "";

    selectEl: HTMLSelectElement;

    updateContent(_e: Event)
    {
        this.inputUpdate.emit({
            formKey: this.formKey,
            value: this.selectEl.value
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
                            <select 
                                ref={el => this.selectEl = el}
                                class={mergeClass("select", this.selectClass)}
                                onChange={e => this.updateContent(e)}
                                disabled={this.disabled}
                            >
                                { this.options.map(({name, value}) => (
                                    <option value={value} selected={value === this.value}>{name}</option>
                                )) }
                            </select>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
