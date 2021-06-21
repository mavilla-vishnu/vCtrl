import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingComponent } from './partials/loading/loading.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { EmployeesListComponent } from './components/Employee/employees-list/employees-list.component';
import { EmployeesCRUDComponent } from './components/Employee/employees-crud/employees-crud.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RoleListComponent } from './components/Roles/role-list/role-list.component';
import { RoleCrudComponent } from './components/Roles/role-crud/role-crud.component';
import { DepartmentListComponent } from './components/Departments/department-list/department-list.component';
import { DepartmentCrudComponent } from './components/Departments/department-crud/department-crud.component';
import { DesignationListComponent } from './components/Designations/designation-list/designation-list.component';
import { DesignationCrudComponent } from './components/Designations/designation-crud/designation-crud.component';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteConfirmationComponent } from './partials/delete-confirmation/delete-confirmation.component';
import { TitleCaseDirective } from './core/Directives/title-case.directive';
import { NumberOnlyDirective } from './core/Directives/number-only.directive';
import { CapialiseTextDirective } from './core/Directives/capialise-text.directive';
import { BranchesListComponent } from './components/Branches/branches-list/branches-list.component';
import { BranchesCRUDComponent } from './components/Branches/branches-crud/branches-crud.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PurchaseOrderComponent } from './components/Accounts/purchase-order/purchase-order.component';
import { SalesOrderComponent } from './components/Accounts/sales-order/sales-order.component';
import { MaterialsComponent } from './components/Miscellaneous/materials/materials.component';
import { VendorsComponent } from './components/Miscellaneous/vendors/vendors.component';
import { CustomersComponent } from './components/Miscellaneous/customers/customers.component';
import { MaterialCrudComponent } from './components/Miscellaneous/materials/material-crud/material-crud.component';
import { NumericDecimalDirective } from './core/Directives/numericdecimal.directive';
import { VendorCrudComponent } from './components/Miscellaneous/vendors/vendor-crud/vendor-crud.component';
import { CustomerCrudComponent } from './components/Miscellaneous/customers/customer-crud/customer-crud.component';
import { PurchaseorderCrudComponent } from './components/Accounts/purchase-order/purchaseorder-crud/purchaseorder-crud.component';
import { PurchaseorderAddMaterialComponent } from './components/Accounts/purchase-order/purchaseorder-add-material/purchaseorder-add-material.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { QuantityPickComponent } from './partials/quantity-pick/quantity-pick.component';
import { ModeOfDispatchComponent } from './components/Miscellaneous/mode-of-dispatch/mode-of-dispatch.component';
import { PaymentTermsComponent } from './components/Miscellaneous/payment-terms/payment-terms.component';
import { WarrantyComponent } from './components/Miscellaneous/warranty/warranty.component';
import { DeliveryScheduleComponent } from './components/Miscellaneous/delivery-schedule/delivery-schedule.component';
import { ModeOfDispatchCrudComponent } from './components/Miscellaneous/mode-of-dispatch/mode-of-dispatch-crud/mode-of-dispatch-crud.component';
import { PaymentTermsCrudComponent } from './components/Miscellaneous/payment-terms/payment-terms-crud/payment-terms-crud.component';
import { WarrantyCrudComponent } from './components/Miscellaneous/warranty/warranty-crud/warranty-crud.component';
import { DeliveryScheduleCrudComponent } from './components/Miscellaneous/delivery-schedule/delivery-schedule-crud/delivery-schedule-crud.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoadingComponent,
    EmployeesListComponent,
    EmployeesCRUDComponent,
    RoleListComponent,
    RoleCrudComponent,
    DepartmentListComponent,
    DepartmentCrudComponent,
    DesignationListComponent,
    DesignationCrudComponent,
    DeleteConfirmationComponent,
    TitleCaseDirective,
    NumberOnlyDirective,
    CapialiseTextDirective,
    BranchesListComponent,
    BranchesCRUDComponent,
    DashboardComponent,
    PurchaseOrderComponent,
    SalesOrderComponent,
    MaterialsComponent,
    VendorsComponent,
    CustomersComponent,
    MaterialCrudComponent,
    NumericDecimalDirective,
    VendorCrudComponent,
    CustomerCrudComponent,
    PurchaseorderCrudComponent,
    PurchaseorderAddMaterialComponent,
    QuantityPickComponent,
    ModeOfDispatchComponent,
    PaymentTermsComponent,
    WarrantyComponent,
    DeliveryScheduleComponent,
    ModeOfDispatchCrudComponent,
    PaymentTermsCrudComponent,
    WarrantyCrudComponent,
    DeliveryScheduleCrudComponent
  ],
  exports: [
    AngularFireAuthModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    AngularFirestoreModule,
    MatMenuModule,
    MatAutocompleteModule
  ],
  providers: [
    AngularFireAuthGuard,
    MatDatepickerModule,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
