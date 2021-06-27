import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankAccount } from 'src/app/core/modals/BankAccount';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-bank-accounts-crud',
  templateUrl: './bank-accounts-crud.component.html',
  styleUrls: ['./bank-accounts-crud.component.scss']
})
export class BankAccountsCrudComponent implements OnInit {
  accountForm: FormGroup;
  constructor(private loadingService: LoadingService, private afs: AngularFirestore, private snackbar: MatSnackBar, private dialogRef: MatDialogRef<BankAccountsCrudComponent>) { }

  ngOnInit(): void {
    this.accountForm = new FormGroup({
      accountName: new FormControl('', [Validators.required]),
      bankName: new FormControl('', [Validators.required]),
      accontNo: new FormControl('', [Validators.required]),
      branch: new FormControl('', [Validators.required]),
      ifsc: new FormControl('', [Validators.required])
    });
  }
  cancel() {
    this.dialogRef.close({ added: false });
  }

  saveAccount() {
    if (!this.accountForm.valid) {
      this.snackbar.open("Please enter valid bank account details", "OK", { duration: 3000 });
      return;
    }
    var bankModel: BankAccount = {
      id: this.afs.createId(),
      accountName: this.accountForm.controls["accountName"].value,
      bankName: this.accountForm.controls["bankName"].value,
      accontNo: this.accountForm.controls["accontNo"].value,
      branch: this.accountForm.controls["branch"].value,
      ifsc: this.accountForm.controls["ifsc"].value
    };
    this.loadingService.presentLoading("Saving bank account");
    this.afs.collection("bankAccounts").doc(bankModel.id).set(bankModel).then((response: any) => {
      this.snackbar.open("Bank account added successfully", "OK", { duration: 3000 });
      this.loadingService.dismissLoading();
      this.dialogRef.close({ added: true });
    })
  }

}
