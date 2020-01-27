import { Component, h, Prop } from "@stencil/core";

@Component({
    tag: 'gel-table',
    //styleUrl: 'view-list.scss',
})
export class GELTable 
{
    @Prop() columns: string[];
    @Prop() rows: any[];
    
    render()
    {

        return <table class="table">
            <thead>
                <tr>
                    { this.columns.map(col => (
                        <th>{col}</th>
                    )) }
                </tr>
            </thead>
            <tbody>
                { this.rows.map(row => !row ? "" : (
                    <tr>
                        { this.columns.map(col => (
                            <td>{row[col] instanceof Function ? row[col]() : row[col]}</td>
                        ))}
                    </tr>
                )) }
            </tbody>
        </table>;
    }
}