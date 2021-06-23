import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductsCrudComponent } from './products-crud/products-crud.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getProducts(){

  }

  addProduct(){
    const dialogRef = this.dialog.open(ProductsCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getProducts();
      }
    });
  }
}
