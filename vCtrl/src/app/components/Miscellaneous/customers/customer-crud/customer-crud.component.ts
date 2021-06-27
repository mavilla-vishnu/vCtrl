import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from 'src/app/core/modals/Customer';
import { State } from 'src/app/core/modals/States';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { StatesproviderService } from 'src/app/core/Services/statesprovider.service';

@Component({
  selector: 'app-customer-crud',
  templateUrl: './customer-crud.component.html',
  styleUrls: ['./customer-crud.component.scss']
})
export class CustomerCrudComponent implements OnInit {
  customerForm: FormGroup;
  states: State[] = [];
  constructor(private stateervice: StatesproviderService, private dialogRef: MatDialogRef<CustomerCrudComponent>, private snackbar: MatSnackBar, private afs: AngularFirestore, private loadingService: LoadingService, @Inject(MAT_DIALOG_DATA) public data: Customer) { }

  ngOnInit(): void {
    this.states = this.stateervice.getStates();
    this.customerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      addr1: new FormControl('', [Validators.required]),
      addr2: new FormControl('', [Validators.required]),
      gstin: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
    });
    if (this.data != null) {
      this.customerForm.controls["name"].setValue(this.data.name);
      this.customerForm.controls["addr1"].setValue(this.data.addr1);
      this.customerForm.controls["addr2"].setValue(this.data.addr2);
      this.customerForm.controls["gstin"].setValue(this.data.gstin);
      this.customerForm.controls["city"].setValue(this.data.city);
      this.customerForm.controls["state"].setValue(this.data.state.id);
      this.customerForm.controls["pincode"].setValue(this.data.pincode);
    }
  }

  saveCustomer() {
    if (!this.customerForm.valid) {
      this.snackbar.open("Please enter all the required fields!", "OK", { duration: 3000 });
      return;
    }
    if (this.customerForm.controls["gstin"].value != "" && !this.validateGst(this.customerForm.controls["gstin"].value)) {
      this.snackbar.open("Invalid GSTIN entered. It's also optional!", "OK", { duration: 3000 });
      return;
    }
    var id = this.afs.createId();
    var custModal: Customer = {
      name: this.customerForm.controls["name"].value,
      addr1: this.customerForm.controls["addr1"].value,
      addr2: this.customerForm.controls["addr2"].value,
      gstin: this.customerForm.controls["gstin"].value,
      city: this.customerForm.controls["city"].value,
      state: this.states[this.states.findIndex(st => st.id == this.customerForm.controls["state"].value)],
      pincode: this.customerForm.controls["pincode"].value
    };
    if (this.data == null) {
      custModal.id=id,
      this.loadingService.presentLoading("Adding customer...")
      this.afs.collection("customers").doc(id).set(custModal).then(resp => {
        this.dialogRef.close({ added: true });
        this.snackbar.open("Customer saved successfully!", "OK", { duration: 3000 });
        this.loadingService.dismissLoading();
      }).catch(err => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error saving customer!", "OK", { duration: 3000 });
      });
    } else {
      custModal.id=this.data.id,
      this.loadingService.presentLoading("Updating customer...")
      this.afs.collection("customers").doc(this.data.id).set(custModal).then(resp => {
        this.dialogRef.close({ added: true });
        this.snackbar.open("Customer updated successfully!", "OK", { duration: 3000 });
        this.loadingService.dismissLoading();
      }).catch(err => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error updating customer!", "OK", { duration: 3000 });
      });
    }
  }

  cancel() {
    this.dialogRef.close({ added: false });
  }

  validateGst(gstValue) {
    var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;
    return reggst.test(gstValue)
  }

}
