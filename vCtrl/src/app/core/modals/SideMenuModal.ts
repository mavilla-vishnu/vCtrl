export interface SideMenuModal {
    title: string,
    icon: string,
    url: string,
    children?: Array<{
        title: string,
        url: string
    }>,
    isExpanded: boolean,
    showSubmenu: boolean,
    isShowing: boolean,
    showSubSubMenu: boolean
}