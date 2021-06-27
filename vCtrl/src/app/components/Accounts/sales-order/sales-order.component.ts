import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseorderCrudComponent } from '../purchase-order/purchaseorder-crud/purchaseorder-crud.component';
import { SalesOrderCrudComponent } from './sales-order-crud/sales-order-crud.component';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getSos(){

  }

  newSO(){
    const dialogRef = this.dialog.open(SalesOrderCrudComponent, {
      width: '950px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getSos();
      }
    });
  }
}
