import { MaterialTimeLine } from "./MaterialTimeLine";

export interface MaterialModal {
    name: string,
    unit: string,
    price: number,
    id?: string,
    quantity?: number,
    value?: number,
    available: number,
    timeline?: MaterialTimeLine[]
}