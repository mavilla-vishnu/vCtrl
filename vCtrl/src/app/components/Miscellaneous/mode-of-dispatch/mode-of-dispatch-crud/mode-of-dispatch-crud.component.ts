import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModeOfDispatch } from 'src/app/core/modals/ModeOfDispatchModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-mode-of-dispatch-crud',
  templateUrl: './mode-of-dispatch-crud.component.html',
  styleUrls: ['./mode-of-dispatch-crud.component.scss']
})
export class ModeOfDispatchCrudComponent implements OnInit {

  modControl = new FormControl();

  constructor(private snackbar: MatSnackBar, private afs: AngularFirestore, private loadingService: LoadingService, private dialogRef: MatDialogRef<ModeOfDispatchCrudComponent>) { }

  ngOnInit(): void {

  }

  cancel() {

  }

  saveMode() {
    var mod = this.modControl.value;
    if (mod == "") {
      this.snackbar.open("Enter mode of dispatch to save!", "OK", { duration: 2000 });
      return;
    }
    var modToSave: ModeOfDispatch = {
      id: mod.split(" ").join(""),
      name: mod
    }

    this.loadingService.presentLoading("Adding MOD...");
    this.afs.collection("mod").add(modToSave).then(response => {
      this.loadingService.dismissLoading();
      this.dialogRef.close({ added: true });
      this.snackbar.open("MOD added!", "OK", { duration: 3000 });
    }).catch(error => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error saving MOD", "OK", { duration: 3000 });
    });
  }

}
