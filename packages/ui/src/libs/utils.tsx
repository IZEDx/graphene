import {h} from "@stencil/core";

export type ClassList = string|Record<string, boolean>;

export const mergeClass = (...classes: ClassList[]) =>  
    Object.entries(classes
        .map(c => typeof c === "string" 
            ? {[c.trim()]: true} 
            : c
        )
        .reduce((a, b) => ({...a, ...b}))
    )
    .filter(([_, cond]) => cond)
    .map(([c]) => c.trim())
    .join(" ")


export function GraphQLErrorMessage(error?: Error)
{
    const dirty = error?.message ?? "Something went wrong.";
    const sanitized = !dirty.includes(": {") 
        ? dirty
        : dirty.split(": {")[0];
    
    return (
        <div class="notification is-danger">
            {sanitized}
        </div>
    );
}