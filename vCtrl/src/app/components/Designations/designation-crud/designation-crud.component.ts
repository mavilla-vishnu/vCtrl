import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DesignationModal } from 'src/app/core/modals/DesignationModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-designation-crud',
  templateUrl: './designation-crud.component.html',
  styleUrls: ['./designation-crud.component.scss']
})
export class DesignationCrudComponent implements OnInit {

  designationForm: FormGroup;
  designation: DesignationModal;
  title = "Add Designation";
  constructor(private snackbar: MatSnackBar, private afs: AngularFirestore, public dialogRef: MatDialogRef<DesignationCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DesignationModal,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.designationForm = new FormGroup({
      designationName: new FormControl('', [Validators.required]),
      designationDescription: new FormControl(''),
      designationComments: new FormControl(''),
    });
    if (this.data != undefined) {
      this.title = "Update Designation";
      this.designation = this.data;
      this.designationForm.controls["designationName"].setValue(this.designation.designationName);
      this.designationForm.controls["designationDescription"].setValue(this.designation.designationDescription);
      this.designationForm.controls["designationComments"].setValue(this.designation.designationComments);
    } else {
      this.title = "Add Designation";
    }
  }

  saveDesignation() {
    if (!this.designationForm.valid) {
      this.snackbar.open("Please enter valid designation name", "OK", { duration: 3000 });
      return;
    }
    if (this.data == undefined) {
      var id = this.afs.createId();
      var designationModal: DesignationModal = {
        id: id,
        designationName: this.designationForm.controls["designationName"].value,
        designationDescription: this.designationForm.controls["designationDescription"].value,
        designationComments: this.designationForm.controls["designationComments"].value
      };
      this.loadingService.presentLoading("Saving designation...");

      this.afs.collection("designations").doc(id).set(designationModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error saving designation. Please try again later!", "OK", { duration: 3000 });
      });
    } else {
      var designation: DesignationModal = {
        id: this.designation.id,
        designationName: this.designationForm.controls["designationName"].value,
        designationDescription: this.designationForm.controls["designationDescription"].value,
        designationComments: this.designationForm.controls["designationComments"].value
      };
      this.loadingService.presentLoading("Updating designation...");

      this.afs.collection("designations").doc(this.designation.id).set(designationModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error updating designation. Please try again later!", "OK", { duration: 3000 });
      });
    }
  }

  dismiss() {
    this.dialogRef.close({ added: false });
  }

}
