import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-material-crud',
  templateUrl: './material-crud.component.html',
  styleUrls: ['./material-crud.component.scss']
})
export class MaterialCrudComponent implements OnInit {
  materialForm: FormGroup;
  materialModal: MaterialModal;
  material: MaterialModal;
  constructor(public dialogRef: MatDialogRef<MaterialCrudComponent>, private snackbar: MatSnackBar,
    private afs: AngularFirestore,
    private loadingService: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: MaterialModal) { }

  ngOnInit(): void {
    this.materialForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required])
    });
    if (this.data != null) {
      this.materialForm.controls["name"].setValue(this.data.name);
      this.materialForm.controls["unit"].setValue(this.data.unit);
      this.materialForm.controls["price"].setValue(this.data.price);
    }
  }

  saveMaterial() {
    if (!this.materialForm.valid) {
      this.snackbar.open("Please enter valid data!", "OK", { duration: 3000 });
      return;
    }

    this.materialModal = {
      name: this.materialForm.controls["name"].value,
      unit: this.materialForm.controls["unit"].value.toUpperCase(),
      price: this.materialForm.controls["price"].value,
    };
    if(this.data==null){
      this.loadingService.presentLoading("Adding material...");
      this.afs.collection("materials").add(this.materialModal).then(response => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ added: true });
        this.snackbar.open("Material added!", "OK", { duration: 3000 });
      }).catch(error => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Error saving material", "OK", { duration: 3000 });
      });
    }else{
      this.loadingService.presentLoading("Updating material...");
    this.afs.collection("materials").doc(this.data.id).set(this.materialModal).then(response => {
      this.loadingService.dismissLoading();
      this.dialogRef.close({ added: true });
      this.snackbar.open("Material Updated!", "OK", { duration: 3000 });
    }).catch(error => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error Updating material", "OK", { duration: 3000 });
    });
    }
  }

  cancel() {
    this.dialogRef.close({ added: false });
  }


}
