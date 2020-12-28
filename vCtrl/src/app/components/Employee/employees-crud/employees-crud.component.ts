import { Component, OnInit } from '@angular/core';
import { DepartmentModal } from 'src/app/core/modals/DepartmentModal';
import { DesignationModal } from 'src/app/core/modals/DesignationModal';
import { RoleModal } from 'src/app/core/modals/RoleModal/RoleModal';
import { DataProviderService } from 'src/app/core/Services/data-provider.service';

@Component({
  selector: 'app-employees-crud',
  templateUrl: './employees-crud.component.html',
  styleUrls: ['./employees-crud.component.scss']
})
export class EmployeesCRUDComponent implements OnInit {
  rolesArray: RoleModal[] = [];
  departmentArray: DepartmentModal[] = [];
  designationArray: DesignationModal[] = [];
  constructor(private dataProvider: DataProviderService) { }

  ngOnInit(): void {
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

}
