

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
