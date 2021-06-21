import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeliverySchedules } from 'src/app/core/modals/DeliverySchedules';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-delivery-schedule-crud',
  templateUrl: './delivery-schedule-crud.component.html',
  styleUrls: ['./delivery-schedule-crud.component.scss']
})
export class DeliveryScheduleCrudComponent implements OnInit {
  modControl = new FormControl();
  constructor(private snackbar: MatSnackBar, private afs: AngularFirestore, private loadingService: LoadingService, private dialogRef: MatDialogRef<DeliveryScheduleCrudComponent>) { }

  ngOnInit(): void {
  }

  saveSchedule(){
    var mod = this.modControl.value;
    if (mod == "") {
      this.snackbar.open("Enter name of schedule to save!", "OK", { duration: 2000 });
      return;
    }
    var modToSave: DeliverySchedules = {
      id: mod.split(" ").join(""),
      name: mod
    }

    this.loadingService.presentLoading("Adding schedule...");
    this.afs.collection("deliverySchedules").add(modToSave).then(response => {
      this.loadingService.dismissLoading();
      this.dialogRef.close({ added: true });
      this.snackbar.open("schedule added!", "OK", { duration: 3000 });
    }).catch(error => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error saving schedule", "OK", { duration: 3000 });
    });
  }

  cancel(){
    this.dialogRef.close({ added: false });
  }

}
