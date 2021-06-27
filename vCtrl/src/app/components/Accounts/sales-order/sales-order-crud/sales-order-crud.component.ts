import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BranchModal } from 'src/app/core/modals/BranchModal';
import { Customer } from 'src/app/core/modals/Customer';
import { Warranty } from 'src/app/core/modals/WarrantyModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-sales-order-crud',
  templateUrl: './sales-order-crud.component.html',
  styleUrls: ['./sales-order-crud.component.scss']
})
export class SalesOrderCrudComponent implements OnInit {
  soNumber = "SO" + Date.now();
  customerControl = new FormControl('', [Validators.required]);
  soDateControl = new FormControl('', [Validators.required]);
  branchControl = new FormControl('', [Validators.required]);
  warrControl = new FormControl('', [Validators.required]);
  sgstControl = new FormControl('', [Validators.required]);
  cgstControl = new FormControl('', [Validators.required]);
  productsDatasource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'unit', 'quantity', 'price', 'value', 'actions'];
  customers: Customer[] = [];
  branchArray: BranchModal[] = [];
  warranties: Warranty[] = [];
  isInrerState: boolean = false;
  isGstAvaiable: boolean = false;
  selectedCustomer: Customer;
  selectedBranch: BranchModal;

  constructor(private loadingService: LoadingService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.loadingService.presentLoading("Fetching data...");
    this.afs.collection("branches").valueChanges().subscribe((response: any) => {
      this.branchArray = response;
      console.log(this.branchArray);
      this.afs.collection("customers").valueChanges().subscribe((response: any) => {
        this.customers = response;
        this.loadingService.dismissLoading();
      });
    });
  }

  addProduct() {

  }

  getGstValue() {

  }

  getTotalGstValue() {

  }


  customerChanged(event) {
    var index = this.customers.findIndex(cust => cust.id == event.value);
    if (index != -1) {
      this.selectedCustomer = this.customers[index];
      if (this.selectedBranch) {
        this.selectedBranch.state.id == this.selectedCustomer.state.id ? this.isInrerState = true : this.isInrerState = false;
        this.isGstAvaiable=true;
      }else{
        this.isGstAvaiable=false;
      }
    }
  }

  branchChanged(event) {
    var index = this.branchArray.findIndex(cust => cust.id == event.value);
    if (index != -1) {
      this.selectedBranch = this.branchArray[index];
      if (this.selectedCustomer) {
        this.selectedCustomer.state.id == this.selectedBranch.state.id ? this.isInrerState = true : this.isInrerState = false;
        this.isGstAvaiable=true;
      }else{
        this.isGstAvaiable=false;
      }
    }
  }

  addSo(boolPrint: boolean) {

  }

}
