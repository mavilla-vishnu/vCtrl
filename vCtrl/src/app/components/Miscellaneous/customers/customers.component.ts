import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from 'src/app/core/modals/Customer';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { LoadingComponent } from 'src/app/partials/loading/loading.component';
import { CustomerCrudComponent } from './customer-crud/customer-crud.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'gstin', 'state', 'actions'];
  constructor(private dialog: MatDialog, private loadingService: LoadingService, private afs: AngularFirestore, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.customers = [];
    this.loadingService.presentLoading("Fetching customers...")
    this.afs.collection("customers").get().subscribe((dsFromDb: any) => {
      dsFromDb.forEach(element => {
        var materialTemp = element.data();
        materialTemp.id = element.id;
        this.customers.push(materialTemp);
      });
      this.dataSource = new MatTableDataSource(this.customers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
      console.log(this.customers);
    });
  }

  editCustomer(index) {
    const dialogRef = this.dialog.open(CustomerCrudComponent, {
      width: '600px',
      data: this.customers[index]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result!=undefined&&result.added) {
        this.getCustomers();
      }
    });
  }

  deleteCustomer(index) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("customers").doc(this.customers[index].id).delete().then(response => {
          if (response == undefined) {
            this.getCustomers();
            this.snackbar.open("Customer deleted successfully!", "OK", { duration: 3000 });
          }
        });
      }
    });
  }

  addCustomer() {
    const dialogRef = this.dialog.open(CustomerCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getCustomers();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
