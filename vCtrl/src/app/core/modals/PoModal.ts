import { BranchModal } from "./BranchModal";
import { MaterialModal } from "./MaterialModal";
import { VendorModal } from "./VendorModal";

export interface PoModal {
    poDate?: any,
    vendor?: VendorModal,
    branch?: BranchModal,
    materials?: MaterialModal[],
    poNumber?: string,
    gstPercentage?: number,
    totalCost?: number,
    totalQuantity?: number,
    totalGstValue?: number,
    totalValueWithGst?: number
}