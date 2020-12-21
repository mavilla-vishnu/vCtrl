import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { EmployeesListComponent } from './components/Employee/employees-list/employees-list.component';
import { EmployeesCRUDComponent } from './components/Employee/employees-crud/employees-crud.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home", component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, children: [
      { path: "employees", component: EmployeesListComponent },
      { path: "employee", component: EmployeesCRUDComponent },
      { path: "employee/:id", component: EmployeesCRUDComponent }
    ]
  },
  { path: "login", component: LoginComponent, data: { authGuardPipe: redirectLoggedInToItems } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
