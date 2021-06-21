import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentTerms } from 'src/app/core/modals/PaymentTermsModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { PaymentTermsCrudComponent } from './payment-terms-crud/payment-terms-crud.component';

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.scss']
})
export class PaymentTermsComponent implements OnInit {
  paymentTerms: PaymentTerms[] = [];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['within', 'period'];
  constructor(private dialog: MatDialog, private loadingService: LoadingService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.getPaymentTerms();
  }

  getPaymentTerms() {
    this.paymentTerms = [];
    this.loadingService.presentLoading("Fetching Payment Terms...")
    this.afs.collection("paymentTerms").get().subscribe((modsFromDb: any) => {
      modsFromDb.forEach(element => {
        var ptTemp = element.data();
        this.paymentTerms.push(ptTemp);
      });
      this.dataSource = new MatTableDataSource(this.paymentTerms);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
      console.log(this.paymentTerms);
    });
  }

  addPT() {
    const dialogRef = this.dialog.open(PaymentTermsCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getPaymentTerms();
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
