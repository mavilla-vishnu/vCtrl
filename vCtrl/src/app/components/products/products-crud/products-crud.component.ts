import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from 'src/app/core/modals/Product';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-products-crud',
  templateUrl: './products-crud.component.html',
  styleUrls: ['./products-crud.component.scss']
})
export class ProductsCrudComponent implements OnInit {
  product: Product;
  productGroup: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private snackbar: MatSnackBar, private afs: AngularFirestore, private loadingService: LoadingService, private dialogRef: MatDialogRef<ProductsCrudComponent>) { }

  ngOnInit(): void {
    this.productGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      input: new FormControl(''),
      output: new FormControl(''),
      price: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      unit: new FormControl('', [Validators.required])
    });
    console.log(this.data);
    this.product = this.data;
    if (this.product) {
      this.productGroup.controls["name"].setValue(this.product.name);
      this.productGroup.controls["input"].setValue(this.product.input);
      this.productGroup.controls["output"].setValue(this.product.output);
      this.productGroup.controls["price"].setValue(this.product.price);
      this.productGroup.controls["description"].setValue(this.product.productDescription);
      this.productGroup.controls["unit"].setValue(this.product.unit);
    }
  }

  cancel() {
    this.dialogRef.close({ added: false });
  }

  saveSchedule() {
    if (!this.productGroup.valid) {
      this.snackbar.open("Please enter all the mandatory fields", "OK", { duration: 3000 });
      return;
    }
    var product: Product = {
      name: this.productGroup.controls["name"].value,
      productDescription: this.productGroup.controls["description"].value,
      input: this.productGroup.controls["input"].value,
      output: this.productGroup.controls["output"].value,
      price: this.productGroup.controls["price"].value,
      unit: this.productGroup.controls["unit"].value,
    };
    if (this.product) {
      this.loadingService.presentLoading("Updating product...");
      this.afs.collection("products").doc(this.product.id).set(product).then(response => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Product updated successfully!", "OK", { duration: 3000 });
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.snackbar.open("Error updating product. Please try again later!", "OK", { duration: 3000 });
        this.loadingService.dismissLoading();
      });
    } else {
      this.loadingService.presentLoading("Saving product...");
      this.afs.collection("products").add(product).then(response => {
        this.loadingService.dismissLoading();
        this.snackbar.open("Product saved successfully!", "OK", { duration: 3000 });
        this.dialogRef.close({ added: true });
      }).catch(error => {
        this.snackbar.open("Error saving product. Please try again later!", "OK", { duration: 3000 });
        this.loadingService.dismissLoading();
      });
    }
  }

}
