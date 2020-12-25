import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { EmployeesListComponent } from './components/Employee/employees-list/employees-list.component';
import { EmployeesCRUDComponent } from './components/Employee/employees-crud/employees-crud.component';
import { RoleListComponent } from './components/Roles/role-list/role-list.component';
import { RoleCrudComponent } from './components/Roles/role-crud/role-crud.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home", component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, children: [
      { path: "employees", component: EmployeesListComponent },
      { path: "employee", component: EmployeesCRUDComponent },
      { path: "employee/:id", component: EmployeesCRUDComponent },
      { path: "roles", component: RoleListComponent },
      { path: "role/:id", component: RoleCrudComponent },
      { path: "departments", component: RoleListComponent },
      { path: "department/:id", component: RoleListComponent },
      { path: "designations", component: RoleListComponent },
      { path: "designation/:id", component: RoleListComponent },
    ]
  },
  { path: "login", component: LoginComponent, data: { authGuardPipe: redirectLoggedInToItems } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
