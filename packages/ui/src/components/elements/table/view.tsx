import { Component, h, Prop } from "@stencil/core";
import { RouterHistory, injectHistory } from "@stencil/router";

@Component({
    tag: 'gel-table',
    //styleUrl: 'view-list.scss',
})
export class GELTable 
{
    @Prop() columns: string[];
    @Prop() rows: any[];
    @Prop() linkTo?: (row: any, idx: number) => any
    @Prop() history: RouterHistory;
    
    render()
    {

        return <table class="table">
            <thead>
                <tr>
                    { this.columns?.map(col => (
                        <th>{col}</th>
                    )) }
                </tr>
            </thead>
            <tbody>
                { this.rows?.map((row, idx) => [row, idx]).filter(row => !!row[0]).map(([row, idx]) => this.renderRow(row, idx)) }
            </tbody>
        </table>;
    }

    renderRow(row: any, idx: number)
    {
        return <tr class="clickable" onClick={() => {
            const link = this.linkTo?.(row, idx);
            if (link) this.history.push(link, {});
        }}>
            { this.columns.map(col => (
                <td>{row[col] instanceof Function ? row[col]() : row[col]}</td>
            ))}
        </tr>;
    }
}

injectHistory(GELTable);