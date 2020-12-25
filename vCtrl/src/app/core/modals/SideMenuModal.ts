export interface SideMenuModal {
    title: string,
    icon: string,
    url: string,
    children?: Array<{
        title: string,
        url: string
    }>
}