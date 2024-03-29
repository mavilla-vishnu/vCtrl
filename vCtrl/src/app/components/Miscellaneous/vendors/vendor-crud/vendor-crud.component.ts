import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private afs: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: VendorModal
  ) { }

  ngOnInit(): void {
    this.vendorForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      cin_no: new FormControl("", [Validators.required]),
      gst_no: new FormControl(""),
      addr1: new FormControl("", [Validators.required]),
      addr2: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      pincode: new FormControl("", [Validators.required, Validators.maxLength(6), Validators.minLength(6)])
    });
    if (this.data != null) {
      this.vendorForm.controls["name"].setValue(this.data.name);
      this.vendorForm.controls["cin_no"].setValue(this.data.cin_no);
      this.vendorForm.controls["gst_no"].setValue(this.data.gst_no);
      this.vendorForm.controls["addr1"].setValue(this.data.addr1);
      this.vendorForm.controls["addr2"].setValue(this.data.addr2);
      this.vendorForm.controls["city"].setValue(this.data.city);
      this.vendorForm.controls["state"].setValue(this.data.state);
      this.vendorForm.controls["pincode"].setValue(this.data.pincode);
    }
  }

  save() {
    if (!this.vendorForm.valid) {
      this.snackbar.open("Please enter valid data", "OK", { duration: 3000 });
      return;
    }
    if (this.vendorForm.controls["gst_no"].value != "" && !this.validateGst(this.vendorForm.controls["gst_no"].value)) {
      this.snackbar.open("Invalid GSTIN entered. It's also optional!", "OK", { duration: 3000 });
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
    if (this.data == null) {
      this.loadingService.presentLoading("Adding vendor...")
      this.afs.collection("vendors").add(this.vendorModal).then(resp => {
        this.dialogRef.close({ added: true });
        this.snackbar.open("Vendor saved successfully!", "OK", { duration: 3000 });
        this.loadingService.dismissLoading();
      }).catch(err => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error saving vendor!", "OK", { duration: 3000 });
      });
    } else {
      this.loadingService.presentLoading("Updating vendor...")
      this.afs.collection("vendors").doc(this.data.id).set(this.vendorModal).then(resp => {
        this.dialogRef.close({ added: true });
        this.snackbar.open("Vendor updated successfully!", "OK", { duration: 3000 });
        this.loadingService.dismissLoading();
      }).catch(err => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error updating vendor!", "OK", { duration: 3000 });
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
