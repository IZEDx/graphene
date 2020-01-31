import { Component, h, Listen } from "@stencil/core";

@Component({
    tag: 'gel-form',
    styleUrl: 'form.scss',
})
export class GELForm 
{

    @Listen("inputUpdate")
    onInputUpdate(e: CustomEvent<{formKey: string, value: string}>)
    {
        console.log("Form Update", e.detail);
    }
    
    render()
    {
        return <slot />;
    }
}
