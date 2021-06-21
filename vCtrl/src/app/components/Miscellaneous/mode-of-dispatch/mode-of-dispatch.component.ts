import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModeOfDispatch } from 'src/app/core/modals/ModeOfDispatchModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { ModeOfDispatchCrudComponent } from './mode-of-dispatch-crud/mode-of-dispatch-crud.component';

@Component({
  selector: 'app-mode-of-dispatch',
  templateUrl: './mode-of-dispatch.component.html',
  styleUrls: ['./mode-of-dispatch.component.scss']
})
export class ModeOfDispatchComponent implements OnInit {
  mods: ModeOfDispatch[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private loadingService: LoadingService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.getModeOfDispatch();
  }

  getModeOfDispatch() {
    this.mods = [];
    this.loadingService.presentLoading("Fetching MOD's...")
    this.afs.collection("mod").get().subscribe((modsFromDb: any) => {
      modsFromDb.forEach(element => {
        var materialTemp = element.data();
        this.mods.push(materialTemp);
      });
      this.dataSource = new MatTableDataSource(this.mods);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
      console.log(this.mods);
    });
  }

  addModeofDispatch() {
    const dialogRef = this.dialog.open(ModeOfDispatchCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getModeOfDispatch();
      }
    });
  }

  editMOD(index) {

  }

  deleteMOD(index) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
