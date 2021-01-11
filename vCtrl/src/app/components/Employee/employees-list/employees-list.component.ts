import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentModal } from 'src/app/core/modals/DepartmentModal';
import { DesignationModal } from 'src/app/core/modals/DesignationModal';
import { EmployeeModal } from 'src/app/core/modals/Employee';
import { RoleModal } from 'src/app/core/modals/RoleModal/RoleModal';
import { DataProviderService } from 'src/app/core/Services/data-provider.service';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { EmployeesCRUDComponent } from '../employees-crud/employees-crud.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  displayedColumns: string[] = ['first_name', 'role', 'department', 'designation', 'personal_phone', 'actons'];
  dataSource: MatTableDataSource<EmployeeModal>;
  employeeArray: EmployeeModal[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  departmentArray: DepartmentModal[] = [];
  designationsArray: DesignationModal[] = [];
  rolesArray: RoleModal[] = []
  constructor(private afs: AngularFirestore, private router: Router ,private dataProvider: DataProviderService, private dialog: MatDialog, private snackbar: MatSnackBar, private loader: LoadingService) { }

  ngAfterViewInit() {
    this.dataProvider.getDepartments().then((departments: any) => {
      this.departmentArray = departments;
    });
    this.dataProvider.getDesignations().then((designations: any) => {
      this.designationsArray = designations;
    });
    this.dataProvider.getRoles().then((roles: any) => {
      this.rolesArray = roles;
    });
    this.getEmployees();
  }

  getEmployees() {
    this.loader.presentLoading("Fetching employees...");
    this.afs.collection("employees").get().subscribe((employees: any) => {
      this.employeeArray = employees.docs.map(doc => doc.data())
      this.employeeArray.forEach(employee => {
        employee.designation = this.designationsArray[this.designationsArray.findIndex(x => x.id === employee.designation)].designationName;
      });
      this.employeeArray.forEach(employee => {
        employee.department = this.departmentArray[this.departmentArray.findIndex(x => x.id === employee.department)].departmentName;
      });
      this.employeeArray.forEach(employee => {
        employee.role = this.rolesArray[this.rolesArray.findIndex(x => x.id === employee.role)].roleName;
      });
      this.dataSource = new MatTableDataSource(this.employeeArray);
      this.loader.dismissLoading();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(employee) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("employees").doc(employee.id).delete().then(response => {
          if (response == undefined) {
            this.getEmployees();
            this.snackbar.open("Employee deleted successfully!", "OK", { duration: 3000 });
          }
        });
      }
    });
  }

  exportEmployee() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header = [
      "First name", 
      "Last name"

    ]
    worksheet.addRow(header);

    let dateString = new Date();
    let fname = "Emp Data " + dateString.getMonth() + " " + dateString.getFullYear();
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }

  editEmployee(employee){
    this.router.navigateByUrl('/home/employee/'+employee.id);
  }

  ngOnInit(): void {
  }

}
