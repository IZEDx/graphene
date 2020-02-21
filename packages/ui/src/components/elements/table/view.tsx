import { Component, h, Prop, Host } from "@stencil/core";
import { RouterHistory, injectHistory } from "@stencil/router";

@Component({
    tag: 'gel-table',
    styleUrl: 'style.scss',
})
export class GELTable 
{
    @Prop() columns: string[];
    @Prop() rows: any[];
    @Prop() linkTo?: (row: any) => any
    @Prop() history: RouterHistory;
    
    @Prop({mutable: true}) sortBy = "id";
    @Prop({mutable: true}) order: "ASC"|"DESC" = "ASC";

    render()
    {
        if (!this.columns.includes(this.sortBy)) this.sortBy = this.columns[0];
        if (!this.sortBy || this.order !== "ASC" && this.order !== "DESC") return "WTF";

        const rows = this.rows
            .filter(row => !!row)
            .sort(this.sortRows)
            .map((row, idx) => [row, idx]);

        return <Host>
            { this.columns?.map(this.renderHeader) }
            { this.renderHeader("") }
            { rows.map(this.renderRow) }
        </Host>
    }

    sortRows = (a: any, b: any) =>
    {
        let av = this.renderValue(a[this.sortBy]);
        let bv = this.renderValue(b[this.sortBy]);
        
        if (!isNaN(parseFloat(av)) && !isNaN(parseFloat(bv)))
        {
            av = parseFloat(av);
            bv = parseFloat(bv);
        }

        return this.order === "ASC" && av > bv || this.order === "DESC" && (bv > av || av === undefined)
            ? 1
            : -1;
    }

    renderHeader = (col: string) => 
    (
        <div class="table-cell is-header clickable"
            onClick={() => {
                if (this.sortBy === col)
                {
                    this.order = this.order === "ASC" ? "DESC" : "ASC";
                }
                else
                {
                    this.sortBy = col;
                }
            }}
        >
            {col}
            <span class={{
                "sort-indicator": true,
                "is-active": this.sortBy === col
            }}>
            { this.order === "ASC"
                ? <ion-icon name="caret-up-outline"></ion-icon>
                : <ion-icon name="caret-down-outline"></ion-icon>
            }
            </span>
        </div>
    )

    goto = (row: any, del?: boolean) => () =>
    {
        const link = this.linkTo?.(row);
        console.log(link);
        if (link) this.history.push(link + (del ? "/delete" : ""), {});
    }

    onClick={}

    renderRow = ([row, idx]: [any, number]) => 
    [
        ...this.columns.map(col => 
        (
            <div class="table-cell clickable" onClick={this.goto(row)} style={{"grid-row": idx + 2 + ""}}>{this.renderValue(row[col])}</div>
        )),
        <div class="table-cell is-actions" style={{"grid-row": idx + 2 + ""}}>
            <button class="button is-small is-warning" onClick={this.goto(row)}>
                <ion-icon name="create"></ion-icon>
            </button>
            <div class="gap"></div>
            <button class="button is-small is-danger" onClick={this.goto(row, true)}>
                <ion-icon name="trash"></ion-icon>
            </button>
        </div>
    ]


    renderValue = (v: any) => v instanceof Function ? v() : v;
    /*
    render()
    {

        return <table class="table is-striped is-hoverable is-fullwidth">
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
    */

}

injectHistory(GELTable);