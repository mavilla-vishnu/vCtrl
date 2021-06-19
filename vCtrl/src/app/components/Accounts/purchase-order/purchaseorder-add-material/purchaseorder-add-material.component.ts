import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-purchaseorder-add-material',
  templateUrl: './purchaseorder-add-material.component.html',
  styleUrls: ['./purchaseorder-add-material.component.scss']
})
export class PurchaseorderAddMaterialComponent implements OnInit {
  myControl = new FormControl();
  quantityControl = new FormControl();
  materials: MaterialModal[] = [];
  filteredOptions: Observable<MaterialModal[]>;
  selectedMaterial: MaterialModal;
  amount: number = 0.00;
  constructor(
    private afs: AngularFirestore,
    private loading: LoadingService,
    private toaster: MatSnackBar,
    private dialogRef: MatDialogRef<PurchaseorderAddMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getMaterials();
    console.log(this.data);
    this.quantityControl.valueChanges.subscribe(value => {
      var quantity = parseFloat(value);
      if (quantity > 0 && this.selectedMaterial) {
        this.amount = parseFloat((this.selectedMaterial.price * quantity).toFixed(2));
        this.selectedMaterial.quantity = quantity;
        this.selectedMaterial.value=this.amount;
      }
    });
    this.myControl.valueChanges.subscribe((value) => {
      if (value == "") {
        this.selectedMaterial = null;
        this.amount = 0;
        this.quantityControl.setValue("");
      }
    })
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({ added: false });
    });
  }

  addItem() {
    if (!this.selectedMaterial) {
      this.toaster.open("Please select a material!", "OK", { duration: 2000 });
      return;
    }
    if (parseFloat(this.quantityControl.value) <= 0 || this.quantityControl.value == "") {
      this.toaster.open("Please enter valid quantity!", "OK", { duration: 2000 });
      return;
    }

    this.dialogRef.close({ added: true, data: this.selectedMaterial });
  }

  cancel() {
    this.dialogRef.close({ added: false });
  }

  getMaterials() {
    this.loading.presentLoading("Fetching materials..")
    this.materials = [];
    this.afs.collection("materials").get().subscribe((mats: any) => {
      mats.forEach(material => {
        var matTemp: MaterialModal = material.data();
        matTemp.id = material.id;
        this.materials.push(matTemp);
      })
      this.loading.dismissLoading();
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.materials.slice())
        );
    })
  }

  materialSelected(event) {
    var materialAdded = false;
    this.data.materials.forEach(mats => {
      if (mats.id == event.option.value.id) {
        materialAdded = true;
      }
    });
    console.log(materialAdded);
    if (!materialAdded) {
      this.selectedMaterial = event.option.value;
      this.quantityControl.setValue("");
      this.amount = 0.00;
    } else {
      this.toaster.open("Material already added!", "OK", { duration: 2000 });
      this.myControl.setValue("");
      this.selectedMaterial = null;
      this.quantityControl.setValue("");
      this.amount = 0.00;
    }
  }

  displayFn(material: MaterialModal): string {
    return material && material.id ? material.name : '';
  }

  private _filter(name: string): MaterialModal[] {
    const filterValue = name.toLowerCase();

    return this.materials.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
