import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/modals/Product';

@Component({
  selector: 'app-products-crud',
  templateUrl: './products-crud.component.html',
  styleUrls: ['./products-crud.component.scss']
})
export class ProductsCrudComponent implements OnInit {
  product: Product;
  constructor() { }

  ngOnInit(): void {
    
  }

  cancel(){

  }

  saveSchedule(){

  }

}
