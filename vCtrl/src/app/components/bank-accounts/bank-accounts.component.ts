import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BankAccount } from 'src/app/core/modals/BankAccount';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { BankAccountsCrudComponent } from './bank-accounts-crud/bank-accounts-crud.component';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent implements OnInit {
  accounts: BankAccount[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['bankName', 'accontNo', 'branch', 'ifsc', 'actons'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.getBankAccounts();
  }

  getBankAccounts() {
    this.loadingService.presentLoading("Fetching bank accounts...");
    this.afs.collection("bankAccounts").valueChanges().subscribe((response: any) => {
      this.accounts = response;
      this.dataSource = new MatTableDataSource(this.accounts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }
  addAccount() {
    const dialogRef = this.dialog.open(BankAccountsCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.added) {
        this.getBankAccounts();
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
