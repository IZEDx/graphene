import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { mergeClass } from "../../../../libs/utils";

@Component({
    tag: 'gel-input-text',
    //styleUrl: 'view-list.scss',
})
export class GELInputText
{
    @Event() inputUpdate: EventEmitter<{formKey: string, value: any}>;

    @Prop() formKey: string;
    @Prop() label?: string;
    @Prop() value?: string;
    @Prop() disabled?: boolean;
    @Prop() placeholder?: string;
    @Prop() inputClass: string|Record<string, boolean> = "";
    @Prop() type = "text"

    inputEl: HTMLInputElement;

    updateContent(_e: KeyboardEvent)
    {
        this.inputUpdate.emit({
            formKey: this.formKey,
            value: this.inputEl.value
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
                                class={mergeClass("input", this.inputClass)}
                                type={this.type} 
                                placeholder={this.placeholder} 
                                value={this.value} 
                                onKeyUp={e => this.updateContent(e)}
                                disabled={this.disabled}
                            />
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
