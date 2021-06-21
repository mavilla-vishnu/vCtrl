import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Warranty } from 'src/app/core/modals/WarrantyModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { WarrantyCrudComponent } from './warranty-crud/warranty-crud.component';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.scss']
})
export class WarrantyComponent implements OnInit {
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  warranties: Warranty[] = [];
  displayedColumns: string[] = ['within', 'period'];
  constructor(private dialog: MatDialog, private loadingService: LoadingService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.getWarranties()
  }

  getWarranties() {
    this.warranties = [];
    this.loadingService.presentLoading("Fetching warranties...")
    this.afs.collection("warranties").get().subscribe((modsFromDb: any) => {
      modsFromDb.forEach(element => {
        var ptTemp = element.data();
        this.warranties.push(ptTemp);
      });
      this.dataSource = new MatTableDataSource(this.warranties);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
      console.log(this.warranties);
    });
  }

  addWarranty() {
    const dialogRef = this.dialog.open(WarrantyCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getWarranties();
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
