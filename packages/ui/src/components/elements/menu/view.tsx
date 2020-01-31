import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { Category, MenuItem } from "./model";
import { ClassList, mergeClass } from "../../../libs/utils";
import { injectHistory, RouterHistory, LocationSegments } from "@stencil/router";


@Component({
    tag: 'gel-menu',
    //styleUrl: 'gel-menu.scss',
})
export class GELMenu 
{
    @Event() navigate: EventEmitter<MenuItem>;

    @Prop() history: RouterHistory;
    @Prop() location: LocationSegments;

    @Prop() categories: Category[];
    @Prop() menuClass: ClassList = {};
    @Prop() categoryClass: ClassList = {};
    @Prop() listClass: ClassList = {};
    @Prop() anchorClass: ClassList = {};

    render()
    {
        return <aside class={mergeClass("menu", this.menuClass)}>
            { this.categories.map(({name, items}) => ([
                !name || name === "null" ? "" : 
                <p class={mergeClass("menu-label", this.categoryClass)}>
                    {name}
                </p>,
                <ul class={mergeClass("menu-list", this.listClass)}>
                    {...items.map(item => this.renderMenuItem(item))}
                </ul>
            ])) }
        </aside>;  
    }

    renderMenuItem(item: MenuItem)
    {
        return <li>
            <stencil-route-link 
                anchorClass={mergeClass("flex-grow", this.anchorClass, {
                    "is-active": item.exact ? this.location.pathname === item.url : this.location.pathname.startsWith(item.url)
                })}
                class="no-padding is-flex-stretch clickable" 
                url={item.url}
                exact={item.exact}
                onClick={() => this.navigate.emit(item)}
            >
                {item.name}
            </stencil-route-link>
            <ul>
                { item.children?.map(child => this.renderMenuItem(child)) ?? ""}
            </ul>
        </li>;
    }
}

injectHistory(GELMenu);