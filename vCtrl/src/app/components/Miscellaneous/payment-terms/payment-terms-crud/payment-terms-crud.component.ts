import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { PaymentTerms } from 'src/app/core/modals/PaymentTermsModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-payment-terms-crud',
  templateUrl: './payment-terms-crud.component.html',
  styleUrls: ['./payment-terms-crud.component.scss']
})
export class PaymentTermsCrudComponent implements OnInit {
  withinControl = new FormControl();
  periodControl = new FormControl();

  constructor(private snackbar: MatSnackBar, private loadingService: LoadingService, private afs: AngularFirestore, private dialogRef: MatDialogRef<PaymentTermsCrudComponent>) { }

  ngOnInit(): void {

  }

  cancel() {
    this.dialogRef.close({ added: false });
  }

  saveTerm() {
    if (this.withinControl.value == "") {
      this.snackbar.open("Please enter within time in number", "OK", { duration: 2000 });
      return;
    }
    if (this.periodControl.value == null || this.periodControl.value == undefined) {
      this.snackbar.open("Please select period time", "OK", { duration: 2000 });
      return;
    }
    var pt: PaymentTerms = {
      within: this.withinControl.value,
      period: this.periodControl.value,
      ptName: this.withinControl.value + " " + this.periodControl.value
    };
    this.loadingService.presentLoading("Adding new term...");
    this.afs.collection("paymentTerms").add(pt).then(response => {
      this.loadingService.dismissLoading();
      this.dialogRef.close({ added: true });
      this.snackbar.open("Term added!", "OK", { duration: 3000 });
    }).catch(error => {
      this.loadingService.dismissLoading();
      this.snackbar.open("Error saving Term", "OK", { duration: 3000 });
    });
  }

}
