import { Component, ComponentInterface, Prop, Event, EventEmitter, h } from '@stencil/core';
import { RouteRenderProps, LocationSegments } from '@stencil/router';
  
let lastKey = '';
let lastEvent = '';
let props: RouteRenderProps;

@Component({
    tag: 'util-route-listener'
})
export class UtilRouteListener implements ComponentInterface 
{
    @Prop() props: RouteRenderProps | undefined;

    @Event() pageEnter: EventEmitter<LocationSegments>;
    @Event() pageLeave: EventEmitter<LocationSegments>;
    @Event() pageWillUpdate: EventEmitter<LocationSegments>;
    @Event() pageDidUpdate: EventEmitter<LocationSegments>;

    private localPageSegments: LocationSegments | null = null;

    private get currentPageLocation(): LocationSegments 
    {
        return (this.props || props).history.location;
    }

    private _callEvent(event: 'pageLeave' | 'pageEnter' | 'pageWillUpdate' | 'pageDidUpdate', location: LocationSegments) 
    {
        if (lastEvent === event && lastKey === location.key) return;

        switch (event)
        {
            case "pageEnter":
                this.pageEnter.emit(location);
                break;
            case "pageLeave":
                this.pageLeave.emit(location);
                break;
            case "pageWillUpdate":
                this.pageWillUpdate.emit(location);
                break;
            case "pageDidUpdate":
                this.pageDidUpdate.emit(location);
                break;
    }

        lastEvent = event;
        lastKey = location.key;
    }

    componentWillLoad() {
        if (!this.props) {
            throw Error('Please add props to <util-route-listener />!');
        }

        props = this.props;
        this.localPageSegments = this.currentPageLocation;
        lastKey = this.currentPageLocation.key;
    }

    componentDidLoad() {
        if (lastKey === this.currentPageLocation.key) {
            this._callEvent('pageEnter', this.currentPageLocation);
        }
    }

    componentDidUnload() {
        if (lastKey !== this.currentPageLocation.key) {
            this._callEvent('pageLeave', this.localPageSegments);
        }
    }

    componentWillUpdate() {
        if (lastKey !== this.currentPageLocation.key) {
            this._callEvent('pageWillUpdate', this.localPageSegments);
        }
    }

    componentDidUpdate() {
        if (lastKey !== this.currentPageLocation.key) {
            this._callEvent('pageDidUpdate', this.currentPageLocation);
            this.localPageSegments = this.currentPageLocation;
            lastKey = this.currentPageLocation.key;
        }
    }

    render() {
        return <this.props.component {...this.props} />;
    }
}