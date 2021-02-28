import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { PurchaseorderAddMaterialComponent } from '../purchaseorder-add-material/purchaseorder-add-material.component';

@Component({
  selector: 'app-purchaseorder-crud',
  templateUrl: './purchaseorder-crud.component.html',
  styleUrls: ['./purchaseorder-crud.component.scss']
})
export class PurchaseorderCrudComponent implements OnInit {
  materials: MaterialModal[] = [];
  vendorControl: FormControl = new FormControl();
  poDateControl: FormControl = new FormControl();
  materialsDataSource = new MatTableDataSource(this.materials);
  displayedColumns: string[] = ['name', 'unit', 'quantity', 'price', 'value', 'actions'];
  poNumber = "PO" + Date.now();
  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  addPo() {
    console.log(this.poDateControl.value);
    if (this.vendorControl.value == null) {
      this.snackbar.open("Please select vendor", "OK", { duration: 2000 });
      return;
    }
    if(this.poDateControl.value==null){
      this.snackbar.open("Please pick PO date", "OK", { duration: 2000 });
      return;
    }
  }

  getTotalCost() {
    return this.materials.map(t => t.price * t.quantity).reduce((acc, value) => acc + value, 0);
  }

  getTotalQuantity() {
    return this.materials.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
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


  ngOnInit(): void {
  }

}
