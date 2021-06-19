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
  gstControl: FormControl = new FormControl();
  materialsDataSource = new MatTableDataSource(this.materials);
  displayedColumns: string[] = ['name', 'unit', 'quantity', 'price', 'value', 'actions'];
  poNumber = "PO" + Date.now();
  vendors: VendorModal[] = [];
  branchArray: BranchModal[] = [];
  purchaseOrder: PoModal = {};
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
    this.purchaseOrder.materials = this.materials;
    this.purchaseOrder.vendor = this.vendors[this.vendors.findIndex(v => v.id == this.vendorControl.value)];
    this.purchaseOrder.poNumber = this.poNumber;
    this.purchaseOrder.poDate = this.poDateControl.value;
    this.purchaseOrder.branch = this.branchArray[this.branchArray.findIndex(b => b.id == this.branchControl.value)];
    this.purchaseOrder.gstPercentage = this.gstControl.value;
    this.purchaseOrder.totalCost = this.getTotalCost();
    this.purchaseOrder.totalQuantity = this.getTotalQuantity();
    this.purchaseOrder.totalGstValue=this.getGstValue();
    this.purchaseOrder.totalValueWithGst=this.getTotalGstValue();
    //Proceed to save PO
    this.loadingService.presentLoading("Saving purchase order...")
    this.afs.collection("po").doc(this.poNumber).set(this.purchaseOrder).then(response => {
      this.loadingService.dismissLoading();
      if (boolPrint) {
        this.pdfService.generatePdfPurchaseModal(this.purchaseOrder);
      }
      this.dialogRef.close({ added: true });
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
        this.loadingService.dismissLoading();
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
