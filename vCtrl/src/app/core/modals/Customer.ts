import { State } from "./States";

export interface Customer{
    id?: string,
    name: string,
    addr1: string,
    addr2: string,
    gstin?: string,
    city: string,
    state: State,
    pincode: string
}