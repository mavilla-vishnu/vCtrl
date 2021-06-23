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
import { MaterialsComponent } from './components/Miscellaneous/materials/materials.component';
import { VendorsComponent } from './components/Miscellaneous/vendors/vendors.component';
import { CustomersComponent } from './components/Miscellaneous/customers/customers.component';
import { ModeOfDispatchComponent } from './components/Miscellaneous/mode-of-dispatch/mode-of-dispatch.component';
import { PaymentTermsComponent } from './components/Miscellaneous/payment-terms/payment-terms.component';
import { WarrantyComponent } from './components/Miscellaneous/warranty/warranty.component';
import { DeliveryScheduleComponent } from './components/Miscellaneous/delivery-schedule/delivery-schedule.component';
import { ProductsComponent } from './components/products/products.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home", component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }, children: [
      { path: "", component: DashboardComponent },
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
      { path: "po", component: PurchaseOrderComponent },
      { path: "so", component: SalesOrderComponent },
      { path: "materials", component: MaterialsComponent },
      { path: "vendors", component: VendorsComponent },
      { path: "customers", component: CustomersComponent },
      { path: "mod", component: ModeOfDispatchComponent },
      { path: "paymentTerms", component: PaymentTermsComponent },
      { path: "warranty", component: WarrantyComponent },
      { path: "deliverySchedule", component: DeliveryScheduleComponent },
      { path: "products", component: ProductsComponent },
    ]
  },
  { path: "login", component: LoginComponent, data: { authGuardPipe: redirectLoggedInToItems } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
