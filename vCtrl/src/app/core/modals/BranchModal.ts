import { State } from "./States";

export interface BranchModal {
    id: string,
    branchName: string,
    branchGstin: string,
    branchhDescription: string,
    city: string,
    state: State,
    pincode: string,
    branchEmail: string,
    branchContact: string
}