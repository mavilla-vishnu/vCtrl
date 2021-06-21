import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeliverySchedules } from 'src/app/core/modals/DeliverySchedules';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeliveryScheduleCrudComponent } from './delivery-schedule-crud/delivery-schedule-crud.component';

@Component({
  selector: 'app-delivery-schedule',
  templateUrl: './delivery-schedule.component.html',
  styleUrls: ['./delivery-schedule.component.scss']
})
export class DeliveryScheduleComponent implements OnInit {
  dschedules: DeliverySchedules[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private loadingService: LoadingService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.getDeliverySchedules();
  }

  getDeliverySchedules(){
    this.dschedules = [];
    this.loadingService.presentLoading("Fetching delivery schedules...")
    this.afs.collection("deliverySchedules").get().subscribe((dsFromDb: any) => {
      dsFromDb.forEach(element => {
        var materialTemp = element.data();
        this.dschedules.push(materialTemp);
      });
      this.dataSource = new MatTableDataSource(this.dschedules);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
      console.log(this.dschedules);
    });
  }

  addDS(){
    const dialogRef = this.dialog.open(DeliveryScheduleCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getDeliverySchedules();
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
