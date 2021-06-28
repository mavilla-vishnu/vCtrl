import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BranchModal } from 'src/app/core/modals/BranchModal';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { PoModal } from 'src/app/core/modals/PoModal';
import { VendorModal } from 'src/app/core/modals/VendorModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { QuantityPickComponent } from 'src/app/partials/quantity-pick/quantity-pick.component';
import { PurchaseOrderComponent } from '../purchase-order.component';
import { PurchaseorderAddMaterialComponent } from '../purchaseorder-add-material/purchaseorder-add-material.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfServiceService } from 'src/app/core/Services/pdf-service.service';
import { PaymentTerms } from 'src/app/core/modals/PaymentTermsModal';
import { Warranty } from 'src/app/core/modals/WarrantyModal';
import { DeliverySchedules } from 'src/app/core/modals/DeliverySchedules';
import { ModeOfDispatch } from 'src/app/core/modals/ModeOfDispatchModal';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-purchaseorder-crud',
  templateUrl: './purchaseorder-crud.component.html',
  styleUrls: ['./purchaseorder-crud.component.scss']
})
export class PurchaseorderCrudComponent implements OnInit {
  materials: MaterialModal[] = [];
  vendorControl: FormControl = new FormControl();
  poDateControl: FormControl = new FormControl();
  branchControl: FormControl = new FormControl();

  ptControl: FormControl = new FormControl();
  modControl: FormControl = new FormControl();
  warrControl: FormControl = new FormControl();
  dsControl: FormControl = new FormControl();

  gstControl: FormControl = new FormControl();
  materialsDataSource = new MatTableDataSource(this.materials);
  displayedColumns: string[] = ['name', 'unit', 'quantity', 'price', 'value', 'actions'];
  poNumber = "PO" + Date.now();

  vendors: VendorModal[] = [];
  branchArray: BranchModal[] = [];
  paymentTerms: PaymentTerms[] = [];
  warranties: Warranty[] = [];
  deliverySchedules: DeliverySchedules[] = [];
  modeOfDispatch: ModeOfDispatch[] = [];
  gstValue = 0;
  totalWithGst = 0;
  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private loadingService: LoadingService,
    private afs: AngularFirestore,
    private dialogRef: MatDialogRef<PurchaseOrderComponent>,
    private pdfService: PdfServiceService
  ) { }

  addPo(boolPrint: boolean) {
    console.log(this.poDateControl.value);
    if (this.vendorControl.value == null) {
      this.snackbar.open("Please select vendor", "OK", { duration: 2000 });
      return;
    }
    if (this.poDateControl.value == null) {
      this.snackbar.open("Please pick PO date", "OK", { duration: 2000 });
      return;
    }
    if (this.branchControl.value == null) {
      this.snackbar.open("Please select branch", "OK", { duration: 2000 });
      return;
    }
    if (this.gstControl.value == null) {
      this.snackbar.open("Please enter GST rate", "OK", { duration: 2000 });
      return;
    }
    if (this.materials.length == 0) {
      this.snackbar.open("Please select atleast one material for PO.", "OK", { duration: 2000 });
      return;
    }
    var purchaseOrder: PoModal = {
      materials: this.materials,
      vendor: this.vendors[this.vendors.findIndex(v => v.id == this.vendorControl.value)],
      poNumber: this.poNumber,
      branch: this.branchArray[this.branchArray.findIndex(b => b.id == this.branchControl.value)],
      gstPercentage: this.gstControl.value,
      poDate: new Date(this.poDateControl.value).toLocaleString(),
      modeOfDispatch: this.modeOfDispatch[this.modeOfDispatch.findIndex(xc => xc.id == this.modControl.value)],
      paymentTerms: this.paymentTerms[this.paymentTerms.findIndex(xc => xc.id == this.ptControl.value)],
      warranty: this.warranties[this.warranties.findIndex(wr => wr.id == this.warrControl.value)],
      deliverySchedule: this.deliverySchedules[this.deliverySchedules.findIndex(xc => xc.id == this.dsControl.value)],
      totalCost: this.getTotalCost(),
      totalQuantity: this.getTotalQuantity(),
      totalGstValue: this.getGstValue(),
      totalValueWithGst: this.getTotalGstValue(),
      stockUpdated: false,
    };

    //Proceed to save PO
    this.loadingService.presentLoading("Saving purchase order...")
    this.afs.collection("po").doc(this.poNumber).set(purchaseOrder).then(response => {
      console.log(response)
      if (boolPrint) {
        this.afs.collection("po").doc(this.poNumber).get().subscribe((response: any) => {
          var poModal: PoModal = response.data();
          console.log(poModal);
          this.pdfService.generatePdfPurchaseModal(poModal);
          this.loadingService.dismissLoading();
          this.dialogRef.close({ added: true });
        })
      } else {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }
    }).catch(error => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error saving PO. Please try again later!", "OK", { duration: 3000 });
    });
  }

  getTotalCost() {
    var totalCost: number = parseFloat((this.materials.map(t => t.price * t.quantity).reduce((acc, value) => acc + value, 0)).toFixed(2));
    return totalCost;
  }

  getTotalQuantity() {
    var quantity: number = parseFloat(this.materials.map(t => t.quantity).reduce((acc, value) => acc + value, 0).toFixed(2));
    return quantity;
  }

  getTotalGstValue() {
    if (parseFloat(this.gstControl.value) > 0) {
      var tc = this.getGstValue();
      var gstVal = this.getTotalCost();
      return parseFloat((tc + gstVal).toFixed(2));
    } else {
      return this.getTotalCost();
    }
  }

  getGstValue() {
    if (parseFloat(this.gstControl.value) > 0) {
      return parseFloat((this.getTotalCost() * (parseFloat(this.gstControl.value) / 100)).toFixed(2));
    } else {
      return 0;
    }
  }

  getBranchesAndVendors() {
    this.branchArray = [];
    this.loadingService.presentLoading("Fetching data...");
    this.afs.collection("branches").valueChanges().subscribe((response: any) => {
      this.branchArray = response;
      this.afs.collection("vendors").get().subscribe((vendorsResp: any) => {
        vendorsResp.forEach(vnd => {
          var vTemp: VendorModal = vnd.data();
          vTemp.id = vnd.id;
          this.vendors.push(vTemp);
        });
        this.afs.collection("deliverySchedules").get().subscribe((dsResp: any) => {
          dsResp.forEach(vnd => {
            var vTemp: DeliverySchedules = vnd.data();
            vTemp.id = vnd.id;
            this.deliverySchedules.push(vTemp);
          });
          this.afs.collection("mod").get().subscribe((modResp: any) => {
            modResp.forEach(vnd => {
              var vTemp: ModeOfDispatch = vnd.data();
              vTemp.id = vnd.id;
              this.modeOfDispatch.push(vTemp);
            });
            this.afs.collection("paymentTerms").get().subscribe((ptResp: any) => {
              ptResp.forEach(vnd => {
                var vTemp: PaymentTerms = vnd.data();
                vTemp.id = vnd.id;
                this.paymentTerms.push(vTemp);
              });
              this.afs.collection("warranties").get().subscribe((warrResp: any) => {
                warrResp.forEach(vnd => {
                  var vTemp: Warranty = vnd.data();
                  vTemp.id = vnd.id;
                  this.warranties.push(vTemp);
                });
                this.loadingService.dismissLoading();
              });
            });
          });
        });
      });
    });
  }

  addMaerial() {
    const dialogRef = this.dialog.open(PurchaseorderAddMaterialComponent, {
      width: '350px',
      data: { materials: this.materials }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.materials.push(result.data);
        this.materialsDataSource = new MatTableDataSource(this.materials);
      }
    });
  }

  deleteItem(transaction) {
    console.log(transaction);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        var index = this.materials.findIndex(mt => mt.id == transaction.id);
        if (index != -1) {
          this.materials.splice(index, 1);
          this.materialsDataSource = new MatTableDataSource(this.materials);
        }
      }
    });
  }

  editItem(transaction) {
    console.log(transaction);
    const dialogRef = this.dialog.open(QuantityPickComponent, {
      width: '250px',
      data: { quantity: transaction.quantity }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.quantity) {
        var index = this.materials.findIndex(mt => mt.id == transaction.id);
        if (index != -1) {
          this.materials[index].quantity = result.quantity;
          this.materialsDataSource = new MatTableDataSource(this.materials);
        }
      }
    });
  }

  ngOnInit(): void {
    this.getBranchesAndVendors();
  }

}
