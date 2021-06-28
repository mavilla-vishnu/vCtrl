import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { MaterialTimelineComponent } from '../material-timeline/material-timeline.component';

@Component({
  selector: 'app-stockmanagement',
  templateUrl: './stockmanagement.component.html',
  styleUrls: ['./stockmanagement.component.scss']
})
export class StockmanagementComponent implements OnInit {
  materials: MaterialModal[] = [];
  dataSource: MatTableDataSource<MaterialModal>;
  displayedColumns: string[] = ['name', 'price', 'available', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.getMaterials();
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

  viewTimeLine(index) {
    const dialogRef = this.dialog.open(MaterialTimelineComponent, {
      width: '600px',
      data: this.materials[index]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.added) {

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
