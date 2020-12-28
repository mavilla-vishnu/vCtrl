import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleModal } from 'src/app/core/modals/RoleModal/RoleModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-role-crud',
  templateUrl: './role-crud.component.html',
  styleUrls: ['./role-crud.component.scss']
})
export class RoleCrudComponent implements OnInit {
  roleForm: FormGroup;
  role: RoleModal;
  title= "Add Role";
  constructor(private snackbar: MatSnackBar, private afs: AngularFirestore, public dialogRef: MatDialogRef<RoleCrudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleModal,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.roleForm = new FormGroup({
      roleName: new FormControl('', [Validators.required]),
      roleDescription: new FormControl(''),
      roleComments: new FormControl(''),
    });
    if (this.data != undefined) {
      this.title="Update Role";
      this.role = this.data;
      this.roleForm.controls["roleName"].setValue(this.role.roleName);
      this.roleForm.controls["roleDescription"].setValue(this.role.roleDescription);
      this.roleForm.controls["roleComments"].setValue(this.role.roleComments);
    }else{
      this.title="Add Role";
    }
  }

  saveRole() {
    if (!this.roleForm.valid) {
      this.snackbar.open("Please enter valid role name", "OK", { duration: 3000 });
      return;
    }
    if (this.data == undefined) {
      var id = this.afs.createId();
      var roleModal: RoleModal = {
        id: id,
        roleName: this.roleForm.controls["roleName"].value,
        roleDescription: this.roleForm.controls["roleDescription"].value,
        roleComments: this.roleForm.controls["roleComments"].value
      };
      this.loadingService.presentLoading("Saving role...");

      this.afs.collection("roles").doc(id).set(roleModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error saving role. Please try again later!", "OK", { duration: 3000 });
      });
    } else {
      var roleModal: RoleModal = {
        id: this.role.id,
        roleName: this.roleForm.controls["roleName"].value,
        roleDescription: this.roleForm.controls["roleDescription"].value,
        roleComments: this.roleForm.controls["roleComments"].value
      };
      this.loadingService.presentLoading("Updating role...");

      this.afs.collection("roles").doc(this.role.id).set(roleModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error updating role. Please try again later!", "OK", { duration: 3000 });
      });
    }
  }

  dismiss() {
    this.dialogRef.close({ added: false });
  }

}
