import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Warranty } from 'src/app/core/modals/WarrantyModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-warranty-crud',
  templateUrl: './warranty-crud.component.html',
  styleUrls: ['./warranty-crud.component.scss']
})
export class WarrantyCrudComponent implements OnInit {
  withinControl = new FormControl();
  periodControl = new FormControl();
  constructor(private afs: AngularFirestore, private dialogRef: MatDialogRef<WarrantyCrudComponent>, private snackbar: MatSnackBar, private loadingService: LoadingService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close({ added: false });
  }

  saveWarranty() {
    if (this.withinControl.value == "") {
      this.snackbar.open("Please enter within time in number", "OK", { duration: 2000 });
      return;
    }
    if (this.periodControl.value == null || this.periodControl.value == undefined) {
      this.snackbar.open("Please select period time", "OK", { duration: 2000 });
      return;
    }
    var pt: Warranty = {
      within: this.withinControl.value,
      period: this.periodControl.value,
      warrName: this.withinControl.value+ " "+ this.periodControl.value
    };
    this.loadingService.presentLoading("Adding new warranty...");
    this.afs.collection("warranties").add(pt).then(response => {
      this.loadingService.dismissLoading();
      this.dialogRef.close({ added: true });
      this.snackbar.open("Wararnty added!", "OK", { duration: 3000 });
    }).catch(error => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error saving warranty", "OK", { duration: 3000 });
    });
  }

}
