import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DesignationModal } from 'src/app/core/modals/DesignationModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { DesignationCrudComponent } from '../designation-crud/designation-crud.component';

@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.scss']
})
export class DesignationListComponent implements OnInit {

  designationArray: DesignationModal[] = [];
  displayedColumns: string[] = ['designationName', 'designationDescription', 'actons'];
  dataSource: MatTableDataSource<DesignationModal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getDesignations();
  }

  getDesignations() {
    this.designationArray = [];
    this.loadingService.presentLoading("Fetching designations...");
    this.afs.collection("designations").valueChanges().subscribe((response: any) => {
      this.designationArray = response;
      this.dataSource = new MatTableDataSource(this.designationArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }

  addDesignation() {
    const dialogRef = this.dialog.open(DesignationCrudComponent, {
      width: '550px'
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editDesignation(designation) {
    const dialogRef = this.dialog.open(DesignationCrudComponent, {
      width: '550px',
      data: designation
    });
  }

  deleteDesignation(designation: DesignationModal) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("designations").doc(designation.id).delete().then(response => {
          if (response == undefined) {
            this.snackbar.open("Designation deleted successfully!", "OK", { duration: 3000 });
          }
        });
      }
    });
  }

}
