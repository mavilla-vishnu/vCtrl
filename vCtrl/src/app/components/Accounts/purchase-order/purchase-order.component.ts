import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { PoModal } from 'src/app/core/modals/PoModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { PdfServiceService } from 'src/app/core/Services/pdf-service.service';
import { PurchaseorderCrudComponent } from './purchaseorder-crud/purchaseorder-crud.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements AfterViewInit {
  poArray: PoModal[] = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['poNumber', 'poDate', 'totalQuantity', 'totalCost', 'totalGstValue', 'totalValueWithGst', 'actons'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService, private pdfService: PdfServiceService) { }

  ngAfterViewInit() {
    this.getPos();
  }

  getPos() {
    this.poArray = [];
    this.loadingService.presentLoading("Please wait...");
    this.afs.collection("po").valueChanges().subscribe((response: any) => {
      this.poArray = response;
      this.dataSource = new MatTableDataSource(this.poArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }

  ngOnInit(): void {

  }

  newPurchaseOrder() {
    const dialogRef = this.dialog.open(PurchaseorderCrudComponent, {
      width: '950px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getPos();
      }
    });
  }

  printPo(row) {
    this.pdfService.generatePdfPurchaseModal(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
