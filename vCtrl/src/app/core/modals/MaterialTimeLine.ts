export interface MaterialTimeLine {
    id?: string,
    date?: string,
    type?: number,
    quantity?: number,
    poDate?: string,
    soDate?: string,
    poOrderedDate?: string
    poDeliveryDate?: string,
    soDeliveryDate?: string,
    poNumber: string,
    soNumber: string,
    dousedDate?: string,
    previouslyAvailable: number
}