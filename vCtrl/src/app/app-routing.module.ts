import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { EmployeesListComponent } from './components/Employee/employees-list/employees-list.component';
import { EmployeesCRUDComponent } from './components/Employee/employees-crud/employees-crud.component';
import { RoleListComponent } from './components/Roles/role-list/role-list.component';
import { RoleCrudComponent } from './components/Roles/role-crud/role-crud.component';
import { DepartmentListComponent } from './components/Departments/department-list/department-list.component';
import { DesignationListComponent } from './components/Designations/designation-list/designation-list.component';
import { BranchesListComponent } from './components/Branches/branches-list/branches-list.component';
import { BranchesCRUDComponent } from './components/Branches/branches-crud/branches-crud.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PurchaseOrderComponent } from './components/Accounts/purchase-order/purchase-order.component';
import { SalesOrderComponent } from './components/Accounts/sales-order/sales-order.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home", component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, children: [
      {path: "", component: DashboardComponent},
      { path: "employees", component: EmployeesListComponent },
      { path: "employee", component: EmployeesCRUDComponent },
      { path: "employee/:id", component: EmployeesCRUDComponent },
      { path: "roles", component: RoleListComponent },
      { path: "role/:id", component: RoleCrudComponent },
      { path: "departments", component: DepartmentListComponent },
      { path: "department/:id", component: RoleListComponent },
      { path: "designations", component: DesignationListComponent },
      { path: "designation/:id", component: RoleListComponent },
      { path: "branches", component: BranchesListComponent },
      { path: "branch/:id", component: BranchesCRUDComponent },
      { path: "branch", component: BranchesCRUDComponent },
      { path: "po", component: PurchaseOrderComponent},
      { path: "so", component: SalesOrderComponent}
    ]
  },
  { path: "login", component: LoginComponent, data: { authGuardPipe: redirectLoggedInToItems } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
