
export interface Category
{
    name: string;
    items: MenuItem[]
}

export interface MenuItem
{
    name: string;
    url: string;
    exact?: boolean;
    children: MenuItem[];
}
