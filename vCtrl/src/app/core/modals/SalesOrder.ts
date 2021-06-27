import { BranchModal } from "./BranchModal";
import { Product } from "./Product";
import { Warranty } from "./WarrantyModal";

export interface SalesOrder {
    soDate?: any,
    branch?: BranchModal,
    products: Product[],
    soNumber?: string,
    igstPercentage?: number,
    sgstPercentage?: number,
    cgstPercentage?: number,
    totalCost?: number,
    totalQuantity?: number,
    totalGstValue?: number,
    totalValueWithGst?: number,
    warranty?: Warranty,
    isInterState?: boolean
}