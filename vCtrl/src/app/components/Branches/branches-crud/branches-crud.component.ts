import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchModal } from 'src/app/core/modals/BranchModal';
import { DepartmentModal } from 'src/app/core/modals/DepartmentModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-branches-crud',
  templateUrl: './branches-crud.component.html',
  styleUrls: ['./branches-crud.component.scss']
})
export class BranchesCRUDComponent implements OnInit {
  branchForm: FormGroup;
  branch: BranchModal;
  title = "Add Branch";
  constructor(private snackbar: MatSnackBar, private afs: AngularFirestore, public dialogRef: MatDialogRef<BranchesCRUDComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BranchModal,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.branchForm = new FormGroup({
      branchName: new FormControl('', [Validators.required]),
      branchGstin: new FormControl('', [Validators.pattern("^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")]),
      branchhDescription: new FormControl('', [Validators.required]),
      branchEmail: new FormControl('', [Validators.required]),
      branchContact: new FormControl('', [Validators.required])
    });
    if (this.data != undefined) {
      this.title = "Update Branch";
      this.branch = this.data;
      this.branchForm.controls["branchName"].setValue(this.branch.branchName);
      this.branchForm.controls["branchGstin"].setValue(this.branch.branchGstin);
      this.branchForm.controls["branchhDescription"].setValue(this.branch.branchhDescription);
      this.branchForm.controls["branchEmail"].setValue(this.branch.branchEmail);
      this.branchForm.controls["branchContact"].setValue(this.branch.branchContact);
    } else {
      this.title = "Add Branch";
    }
  }

  saveBranch() {
    if (!this.branchForm.valid) {
      this.snackbar.open("Please enter valid branch data", "OK", { duration: 3000 });
      return;
    }
    if (this.data == undefined) {
      var id = this.afs.createId();
      var roleModal: BranchModal = {
        id: id,
        branchName: this.branchForm.controls["branchName"].value,
        branchGstin: this.branchForm.controls["branchGstin"].value,
        branchhDescription: this.branchForm.controls["branchhDescription"].value,
        branchEmail: this.branchForm.controls["branchEmail"].value,
        branchContact: this.branchForm.controls["branchContact"].value
      };
      this.loadingService.presentLoading("Saving branch...");

      this.afs.collection("branches").doc(id).set(roleModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error saving branch. Please try again later!", "OK", { duration: 3000 });
      });
    } else {
      var roleModal: BranchModal = {
        id: this.branch.id,
        branchName: this.branchForm.controls["branchName"].value,
        branchGstin: this.branchForm.controls["branchGstin"].value,
        branchhDescription: this.branchForm.controls["branchhDescription"].value,
        branchEmail: this.branchForm.controls["branchEmail"].value,
        branchContact: this.branchForm.controls["branchContact"].value
      };
      this.loadingService.presentLoading("Updating branch...");

      this.afs.collection("branches").doc(this.branch.id).set(roleModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error updating branch. Please try again later!", "OK", { duration: 3000 });
      });
    }
  }

  dismiss() {
    this.dialogRef.close({ added: false });
  }

}
