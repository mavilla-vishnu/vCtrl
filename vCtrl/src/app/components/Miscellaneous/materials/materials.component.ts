import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { threadId } from 'worker_threads';
import { MaterialCrudComponent } from './material-crud/material-crud.component';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit, AfterViewInit {
  materials: MaterialModal[] = [];  
  dataSource: MatTableDataSource<MaterialModal>;
  displayedColumns: string[] = ['name', 'unit', 'price', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.materials)
    this.getMaterials();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMaterials() {
    this.materials = [];
    this.loadingService.presentLoading("Fetching materials...")
    this.afs.collection("materials").get().subscribe(materials => {
      materials.forEach((material: any) => {
        var materialTemp = material.data();
        materialTemp.id = material.id;
        this.materials.push(materialTemp);
      });
      console.log(this.materials);
      this.dataSource = new MatTableDataSource(this.materials);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }

  editMaterial(i) {
    const dialogRef = this.dialog.open(MaterialCrudComponent, {
      width: '600px',
      data: this.materials[i]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getMaterials();
      }
    });
  }

  deleteMaterial(i) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("materials").doc(this.materials[i].id).delete().then(response => {
          if (response == undefined) {
            this.getMaterials();
            this.snackbar.open("Material deleted successfully!", "OK", { duration: 3000 });
          }
        });
      }
    });
  }

  addMaterial() {
    const dialogRef = this.dialog.open(MaterialCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getMaterials();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
