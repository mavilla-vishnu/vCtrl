import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentModal } from 'src/app/core/modals/DepartmentModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-department-crud',
  templateUrl: './department-crud.component.html',
  styleUrls: ['./department-crud.component.scss']
})
export class DepartmentCrudComponent implements OnInit {
  departmentForm: FormGroup;
  department: DepartmentModal;
  title= "Add Department";
  constructor(private snackbar: MatSnackBar, private afs: AngularFirestore, public dialogRef: MatDialogRef<DepartmentCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DepartmentModal,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.departmentForm = new FormGroup({
      departmentName: new FormControl('', [Validators.required]),
      departmentDescription: new FormControl(''),
      departmentComments: new FormControl(''),
    });
    if (this.data != undefined) {
      this.title="Update Department";
      this.department = this.data;
      this.departmentForm.controls["departmentName"].setValue(this.department.departmentName);
      this.departmentForm.controls["departmentDescription"].setValue(this.department.departmentDescription);
      this.departmentForm.controls["departmentComments"].setValue(this.department.departmentComments);
    }else{
      this.title="Add Department";
    }
  }

  saveDepartment() {
    if (!this.departmentForm.valid) {
      this.snackbar.open("Please enter valid department name", "OK", { duration: 3000 });
      return;
    }
    if (this.data == undefined) {
      var id = this.afs.createId();
      var roleModal: DepartmentModal = {
        id: id,
        departmentName: this.departmentForm.controls["departmentName"].value,
        departmentDescription: this.departmentForm.controls["departmentDescription"].value,
        departmentComments: this.departmentForm.controls["departmentComments"].value
      };
      this.loadingService.presentLoading("Saving department...");

      this.afs.collection("departments").doc(id).set(roleModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error saving department. Please try again later!", "OK", { duration: 3000 });
      });
    } else {
      var roleModal: DepartmentModal = {
        id: this.department.id,
        departmentName: this.departmentForm.controls["departmentName"].value,
        departmentDescription: this.departmentForm.controls["departmentDescription"].value,
        departmentComments: this.departmentForm.controls["departmentComments"].value
      };
      this.loadingService.presentLoading("Updating department...");

      this.afs.collection("departments").doc(this.department.id).set(roleModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error updating department. Please try again later!", "OK", { duration: 3000 });
      });
    }
  }

  dismiss() {
    this.dialogRef.close({ added: false });
  }
}
