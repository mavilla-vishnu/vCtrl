import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { matMenuAnimations } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { MaterialTimeLine } from 'src/app/core/modals/MaterialTimeLine';
import { PoModal } from 'src/app/core/modals/PoModal';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-materials-received',
  templateUrl: './materials-received.component.html',
  styleUrls: ['./materials-received.component.scss']
})
export class MaterialsReceivedComponent implements AfterViewInit {
  displayedColumns = ['name', 'quantity'];
  dataSource = new MatTableDataSource();
  errorArray = [];
  materials: MaterialModal[] = [];
  constructor(private dialogRef: MatDialogRef<MaterialsReceivedComponent>, private loadingService: LoadingService, private afs: AngularFirestore, @Inject(MAT_DIALOG_DATA) public poModal: PoModal, private snackbar: MatSnackBar) { }

  ngAfterViewInit(): void {
    console.log(this.poModal)
    this.dataSource = new MatTableDataSource(this.poModal.materials);
  }

  ngOnInit(): void {

  }

  cancel() {

  }

  save() {
    this.errorArray = [];
    this.poModal.materials.forEach(mat => {
      if (mat.quantity == null) {
        this.errorArray.push({ text: "Please enter valid quantity for material '" + mat.name + "' " })
      }
    });
    if (this.errorArray.length > 0) {
      this.snackbar.open("please enter valid quantities for all materials received  enter 0", "OK", { duration: 3000 });
      return;
    }

    //Save stock
    this.materials = [];
    this.loadingService.presentLoading("Please wait...")
    this.afs.collection("materials").get().subscribe(materials => {
      materials.forEach((material: any) => {
        var materialTemp = material.data();
        materialTemp.id = material.id;
        this.materials.push(materialTemp);
      });
      this.loadingService.dismissLoading();


      this.loadingService.presentLoading("Updating stock...");
      var batch = this.afs.firestore.batch();
      var poref = this.afs.collection("po").doc(this.poModal.id).ref;
      batch.update(poref, { stockUpdated: true });
      this.poModal.materials.forEach(mt => {
        var index = this.materials.findIndex(mm => mm.id == mt.id);
        if (index != -1) {
          mt.available = this.materials[index].available;
          mt.timeline = this.materials[index].timeline
        }
      })
      this.poModal.materials.forEach(material => {
        var ref = this.afs.collection("materials").doc(material.id).ref;
        console.log(material.available + "-" + material.quantity);
        batch.update(ref, { available: (material.available + material.quantity) })
        var timeline: MaterialTimeLine = {
          type: 1,
          date: new Date().toLocaleString(),
          quantity: material.quantity,
          poDate: this.poModal.poDate,
          soDate: "",
          poOrderedDate: this.poModal.poDate,
          poDeliveryDate: new Date().toLocaleDateString(),
          soDeliveryDate: "",
          dousedDate: "",
          poNumber: this.poModal.poNumber,
          soNumber: "",
          previouslyAvailable: material.available
        };
        material.timeline.push(timeline);
        batch.update(ref, { timeline: material.timeline })
      });

      batch.commit().then(resp => {
        this.loadingService.dismissLoading();
        this.dialogRef.close({ confirmation: true });
        this.snackbar.open("Stock updated successfully", "OK", { duration: 3000 });
      });
    });
  }

}
