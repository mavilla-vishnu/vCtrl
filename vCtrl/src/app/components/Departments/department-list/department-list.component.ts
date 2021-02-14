import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentModal } from 'src/app/core/modals/DepartmentModal';
import { RoleModal } from 'src/app/core/modals/RoleModal/RoleModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { DepartmentCrudComponent } from '../department-crud/department-crud.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  departmentArray: DepartmentModal[] = [];
  displayedColumns: string[] = ['departmentName', 'departmentDescription', 'actons'];
  dataSource: MatTableDataSource<DepartmentModal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentArray = [];
    this.loadingService.presentLoading("Fetching departments...");
    this.afs.collection("departments").valueChanges().subscribe((response: any) => {
      this.departmentArray = response;
      this.departmentArray.forEach((dept:any)=>{
        if(dept.departmentName.split(" ").length>2){
          var nameArray=dept.departmentName.split(" ");
          dept.thumbnail=nameArray[0].charAt(0).toUpperCase()+nameArray[1].charAt(0).toUpperCase();
        }else{
          dept.thumbnail=dept.departmentName.charAt(0).toUpperCase()+dept.departmentName.charAt(1).toUpperCase();
        }
      });
      this.dataSource = new MatTableDataSource(this.departmentArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }

  addDepartment() {
    const dialogRef = this.dialog.open(DepartmentCrudComponent, {
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

  editDepartment(department) {
    const dialogRef = this.dialog.open(DepartmentCrudComponent, {
      width: '550px',
      data: department
    });
  }

  deleteDepartment(department: DepartmentModal) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("departments").doc(department.id).delete().then(response => {
          if (response == undefined) {
            this.snackbar.open("Department deleted successfully!", "OK", { duration: 3000 });
          }
        });
      }
    });
  }

}
