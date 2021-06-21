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
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

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

  generateExcelFile(poModal: PoModal) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(poModal.poNumber);

    worksheet.addRow({});
    worksheet.addRow({});

    worksheet.mergeCells("A3:I3");
    const cell = worksheet.getCell('C3');
    cell.value="V-Ctrl Solutions Private Limited ";
    cell.alignment = { horizontal:'center'} ;
    cell.font={name: "Bookman Old Style", size: 20, bold: true};

    //Draw border
    worksheet.getCell('C3').border = {
      top: {style:'medium', color: {argb:'FA000000'}},
      left: {style:'medium', color: {argb:'FA000000'}},
      bottom: {style:'medium', color: {argb:'FA000000'}},
      right: {style:'medium', color: {argb:'FA000000'}}
    };


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, poModal.poNumber + '.xlsx');
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
