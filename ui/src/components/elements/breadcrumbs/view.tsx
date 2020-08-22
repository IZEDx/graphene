import { Component, h, Prop } from "@stencil/core";
import { Breadcrumbs } from "./model";
import { ClassList, mergeClass } from "../../../libs/utils";
import { breadcrumb } from "../../../global/context";


@Component({
    tag: 'gel-breadcrumbs',
    //styleUrl: 'gel-menu.scss',
})
export class GELBreadcrumbs 
{
    @breadcrumb.Context("breadcrumbs") breadcrumbs: Breadcrumbs = [];

    @Prop() breadcrumbClass: ClassList = {};
    @Prop() anchorClass: ClassList = {};

    render()
    {
        return <nav class={mergeClass("breadcrumb", this.breadcrumbClass)} aria-label="breadcrumbs">
            <ul>
                { this.breadcrumbs.map((b, idx) => (
                    <li class={{
                        "is-active": idx === this.breadcrumbs.length - 1
                    }}>
                        { b[2]
                            ? <a href={b[1]} class={mergeClass("no-padding is-flex-stretch clickable", this.anchorClass)}>
                                {b[0]}
                            </a>
                            : <stencil-route-link 
                                anchorClass={mergeClass(this.anchorClass)}
                                class="no-padding is-flex-stretch clickable" 
                                url={b[1]}
                                
                            >
                                {b[0]}
                            </stencil-route-link>
                        }
                    </li>
                )) }
            </ul>
        </nav>;
    }
}