import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorModal } from 'src/app/core/modals/VendorModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-vendor-crud',
  templateUrl: './vendor-crud.component.html',
  styleUrls: ['./vendor-crud.component.scss']
})
export class VendorCrudComponent implements OnInit {
  vendorForm: FormGroup;
  vendorModal: VendorModal;
  constructor(
    private dialogRef: MatDialogRef<VendorCrudComponent>,
    private snackbar: MatSnackBar,
    private loadingService: LoadingService,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.vendorForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      cin_no: new FormControl("", [Validators.required]),
      gst_no: new FormControl("", [Validators.required]),
      addr1: new FormControl("", [Validators.required]),
      addr2: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      pincode: new FormControl("", [Validators.required, Validators.maxLength(6), Validators.minLength(6)])
    });
  }

  save() {
    if (!this.vendorForm.valid) {
      this.snackbar.open("Please enter valid data", "OK", { duration: 3000 });
      return;
    }
    this.vendorModal = {
      name: this.vendorForm.controls["name"].value,
      cin_no: this.vendorForm.controls["cin_no"].value,
      gst_no: this.vendorForm.controls["gst_no"].value,
      addr1: this.vendorForm.controls["addr1"].value,
      addr2: this.vendorForm.controls["addr2"].value,
      city: this.vendorForm.controls["city"].value,
      state: this.vendorForm.controls["state"].value,
      pincode: this.vendorForm.controls["pincode"].value
    };
    this.loadingService.presentLoading("Adding vendor...")
    this.afs.collection("vendors").add(this.vendorModal).then(resp => {
      this.dialogRef.close({ added: true });
      this.snackbar.open("Vendor saved successfully!", "OK", { duration: 3000 });
      this.loadingService.dismissLoading();
    }).catch(err => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error saving vendor!", "OK", { duration: 3000 });
    });
  }

  cancel() {
    this.dialogRef.close({ added: false });
  }

}
