import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { PurchaseorderCrudComponent } from './purchaseorder-crud/purchaseorder-crud.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  newPurchaseOrder() {
    const dialogRef = this.dialog.open(PurchaseorderCrudComponent, {
      width: '850px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
