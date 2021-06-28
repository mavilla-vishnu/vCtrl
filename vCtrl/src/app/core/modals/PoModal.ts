import { BranchModal } from "./BranchModal";
import { DeliverySchedules } from "./DeliverySchedules";
import { MaterialModal } from "./MaterialModal";
import { ModeOfDispatch } from "./ModeOfDispatchModal";
import { PaymentTerms } from "./PaymentTermsModal";
import { VendorModal } from "./VendorModal";
import { Warranty } from "./WarrantyModal";

export interface PoModal {
    id?:string,
    poDate?: string,
    vendor?: VendorModal,
    branch?: BranchModal,
    materials?: MaterialModal[],
    poNumber?: string,
    gstPercentage?: number,
    totalCost?: number,
    totalQuantity?: number,
    totalGstValue?: number,
    totalValueWithGst?: number,
    modeOfDispatch?:ModeOfDispatch,
    paymentTerms?: PaymentTerms,
    warranty?: Warranty,
    deliverySchedule?: DeliverySchedules,
    stockUpdated: boolean
}