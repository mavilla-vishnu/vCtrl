import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quantity-pick',
  templateUrl: './quantity-pick.component.html',
  styleUrls: ['./quantity-pick.component.scss']
})
export class QuantityPickComponent implements OnInit {
  quantity = 0;
  quantityControl = new FormControl();
  constructor(private dialogRef: MatDialogRef<QuantityPickComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.data.quantity) {
      this.quantityControl.setValue(this.data.quantity);
    }
  }

  cancel() {
    this.dialogRef.close({ quantity: this.quantity });
  }

  confirm() {
    if (parseInt(this.quantityControl.value) <= 0) {
      this.snackbar.open("Please enter valid quantity!", "OK", { duration: 2000 });
      return;
    }
    this.dialogRef.close({ quantity: parseInt(this.quantityControl.value) });
  }


}
