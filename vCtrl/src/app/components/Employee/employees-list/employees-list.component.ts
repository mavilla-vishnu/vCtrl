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
import { BranchModal } from 'src/app/core/modals/BranchModal';

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
  rolesArray: RoleModal[] = [];
  branchArray: BranchModal[]=[];
  constructor(private afs: AngularFirestore, private router: Router, private dataProvider: DataProviderService, private dialog: MatDialog, private snackbar: MatSnackBar, private loader: LoadingService) { }

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
    this.dataProvider.getBranches().then((branches: any) => {
      this.branchArray = branches;
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
      this.employeeArray.forEach(employee => {
        employee.branch_id = this.branchArray[this.branchArray.findIndex(x => x.id === employee.branch_id)].branchName;
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
      "Emp ID",
      "First Name",
      "Last Name",
      "Date of Birth",
      "Blood Group",
      "Marital status",
      "Aadhar No",
      "PAN No",
      "Date of Joining",
      "Department",
      "Role",
      "branch name",
      "Designation",
      "Package",
      "Personal Email",
      "Personal Phone",
      "Official Email",
      "Official Phone",
      "Emergency name",
      "Emergency Contact",
      "Emergency Relation",
      "Bank_account Number",
      "Bank IFSC",
      "Bank branch",
      "Bank account name"
    ]
    worksheet.addRow(header);

    this.employeeArray.forEach(employee => {
      var empData = [];
      var dateDob = new Date(employee.dob.toDate());
      var dateDoj = new Date(employee.doj.toDate());
      var doj = ("0" + dateDob.getDate()).slice(-2) + "/" + ("0" + (dateDob.getMonth() + 1)).slice(-2) + "/" +
        dateDob.getFullYear() + " " + ("0" + dateDob.getHours()).slice(-2) + ":" + ("0" + dateDob.getMinutes()).slice(-2);
      var dob = ("0" + dateDoj.getDate()).slice(-2) + "/" + ("0" + (dateDoj.getMonth() + 1)).slice(-2) + "/" +
        dateDoj.getFullYear() + " " + ("0" + dateDoj.getHours()).slice(-2) + ":" + ("0" + dateDoj.getMinutes()).slice(-2);
      empData.push(
        employee.emp_id,
        employee.first_name,
        employee.last_name,
        dob,
        employee.blood_group,
        employee.marital_status,
        "" + employee.aadhar_number,
        employee.pan_number,
        doj,
        employee.department,
        employee.role,
        employee.branch_id,
        employee.designation,
        "" + employee.package,
        employee.personal_email,
        "" + employee.personal_phone,
        employee.official_email,
        "" + employee.official_phone,
        employee.emergency_name,
        "" + employee.emergency_contact,
        employee.emergency_relation,
        "" + employee.bank_account_number,
        employee.bank_ifsc,
        employee.bank_branch,
        employee.bank_account_name
      );
      worksheet.addRow(empData);
    })

    let dateString = new Date();
    let fname = "Emp Data " + dateString.getMonth() + " " + dateString.getFullYear();
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }

  editEmployee(employee) {
    this.router.navigateByUrl('/home/employee/' + employee.id);
  }

  ngOnInit(): void {
  }

}
