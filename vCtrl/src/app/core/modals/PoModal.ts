import { BranchModal } from "./BranchModal";
import { MaterialModal } from "./MaterialModal";
import { VendorModal } from "./VendorModal";

export interface PoModal{
    poDate: string,
    vendor: VendorModal,
    branch: BranchModal,
    materials: MaterialModal[],
    poNumber: string,
    gstPercentage: number
}