
import { Component, h, Prop, Event, EventEmitter, Watch, State } from "@stencil/core";
import tinymce from "tinymce";

@Component({
    tag: 'gel-input-rich',
    //styleUrl: 'switch.scss',
})
export class GELInputRich
{
    @Event() inputUpdate: EventEmitter<{formKey: string, value: any}>;

    @Prop() formKey: string;
    @Prop({mutable: true}) label?: string;
    @Prop() value?: string;
    @Prop() disabled?: boolean;

    @State() _value: string;

    editorEl: HTMLElement;

    @Watch("value")
    componentWillLoad()
    {
        this._value = unescape(this.value);
        if (!this._value || this._value === "undefined") this._value = "";
    }

    componentDidLoad()
    {
        tinymce.init({
            target: this.editorEl,
            plugins: "code",
            base_url: "/assets/tinymce",
            skin: 'oxide-dark',
            content_css: 'dark',
            menubar: false,
            setup: (ed) => {
                ed.on('change', () => {
                    this.updateContent(ed.getContent())
                });
            },
            toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | code',
        } as any)

        this.inputUpdate.emit({
            formKey: this.formKey,
            value: escape(this._value)
        });
    }

    updateContent(newVal: string)
    { 
        if (this.disabled) return;
        this._value = newVal;
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
                        <textarea 
                            ref={el => this.editorEl = el}
                        >{this._value}</textarea>
                    </div>
                </div>
            </div>
        );
    }
}
