import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentModal } from 'src/app/core/modals/DepartmentModal';
import { DesignationModal } from 'src/app/core/modals/DesignationModal';
import { EmployeeModal } from 'src/app/core/modals/Employee';
import { RoleModal } from 'src/app/core/modals/RoleModal/RoleModal';
import { DataProviderService } from 'src/app/core/Services/data-provider.service';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-employees-crud',
  templateUrl: './employees-crud.component.html',
  styleUrls: ['./employees-crud.component.scss']
})
export class EmployeesCRUDComponent implements OnInit {
  rolesArray: RoleModal[] = [];
  departmentArray: DepartmentModal[] = [];
  designationArray: DesignationModal[] = [];

  employeeForm: FormGroup;

  emp_id;
  constructor(private dataProvider: DataProviderService, private snackbar: MatSnackBar, private afs: AngularFirestore, private loader: LoadingService) { }

  ngOnInit(): void {
    this.loader.presentLoading("Fetching employee id...")
    this.afs.collection("indexes").doc("emp_id").get().subscribe(response => {
      this.emp_id=response.data()["emp_id"];
    })
    this.employeeForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      bloodGroup: new FormControl('', [Validators.required]),
      aadharNo: new FormControl('', [Validators.required]),
      panNo: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      package: new FormControl('', [Validators.required]),
      doj: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      personalEmail: new FormControl('', [Validators.required]),
      personalPhone: new FormControl('', [Validators.required]),
      officialEmail: new FormControl('', [Validators.required]),
      officialPhone: new FormControl('', [Validators.required]),
      emergency_name: new FormControl('', [Validators.required]),
      emergency_relationship: new FormControl('', [Validators.required]),
      emergency_phone: new FormControl('', [Validators.required]),
      bank_accno: new FormControl('', [Validators.required]),
      bank_accname: new FormControl('', [Validators.required]),
      bank_accifsc: new FormControl('', [Validators.required]),
      bank_branch: new FormControl('', [Validators.required])
    });
    this.dataProvider.getRoles().then((roles: any) => {
      this.rolesArray = roles;
    });
    this.dataProvider.getDepartments().then((departments: any) => {
      this.departmentArray = departments;
    });
    this.dataProvider.getDesignations().then((designations: any) => {
      this.designationArray = designations;
    });
  }

  saveEmployee() {
    if (!this.employeeForm.valid) {
      this.snackbar.open("Please enter valid data!", "OK", { duration: 3000 });
      return;
    }
    var id = this.afs.createId();
    var employee: EmployeeModal = {
      id: id,
      emp_id: this.emp_id,

      first_name: this.employeeForm.controls["firstName"].value,
      last_name: this.employeeForm.controls["lastName"].value,
      dob: this.employeeForm.controls["dob"].value,
      profileUrl: "",
      blood_group: this.employeeForm.controls["bloodGroup"].value,
      marital_status: this.employeeForm.controls["maritalStatus"].value,
      aadhar_number: this.employeeForm.controls["aadharNo"].value,
      pan_number: this.employeeForm.controls["panNo"].value,

      doj: this.employeeForm.controls["doj"].value,
      department: this.employeeForm.controls["department"].value,
      role: this.employeeForm.controls["role"].value,
      branch_id: this.employeeForm.controls[""].value,
      designation: this.employeeForm.controls[""].value,
      package: this.employeeForm.controls[""].value,

      personal_email: this.employeeForm.controls[""].value,
      personal_phone: this.employeeForm.controls[""].value,
      official_email: this.employeeForm.controls[""].value,
      official_phone: this.employeeForm.controls[""].value,

      emergency_name: this.employeeForm.controls[""].value,
      emergency_contact: this.employeeForm.controls[""].value,
      emergency_relation: this.employeeForm.controls[""].value,

      bank_account_number: this.employeeForm.controls[""].value,
      bank_ifsc: this.employeeForm.controls[""].value,
      bank_branch: this.employeeForm.controls[""].value,
      bank_account_name: this.employeeForm.controls[""].value
    };
    this.loader.presentLoading("Saving employee...");
    this.afs.collection("employees").doc(id).set(employee).then(response => {
      this.afs.collection("indexes").doc("emp_id").set({ emp_id: this.emp_id++ }).then(resp => {
        this.loader.dismissLoading();
        this.snackbar.open("Employee saved successfully!");
      });
    }).catch(error => {
      this.snackbar.open("Error saving employee....")
    });
  }

}
