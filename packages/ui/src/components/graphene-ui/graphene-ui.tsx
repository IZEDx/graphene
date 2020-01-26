import { Component, Prop, h } from '@stencil/core';

@Component({
    tag: 'graphene-ui',
    styleUrl: 'graphene-ui.scss',
})
export class MyComponent 
{

    @Prop() endPoint: string;

    render() {
        return <div>Connecting to {this.endPoint}</div>;
    }
}
