import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
  constructor(public dialogRef: MatDialogRef<MaterialCrudComponent>, private snackbar: MatSnackBar,
    private afs: AngularFirestore,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.materialForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required])
    });
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
    this.loadingService.presentLoading("Adding material...");
    this.afs.collection("materials").add(this.materialModal).then(response => {
      this.loadingService.dismissLoading();
      this.dialogRef.close({ added: true });
      this.snackbar.open("Material added!", "OK", { duration: 3000 });
    }).catch(error => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error saving material", "OK", { duration: 3000 });
    });
  }

  cancel() {
    this.dialogRef.close({ added: false });
  }


}
