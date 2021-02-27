import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { VendorModal } from '../../../core/modals/VendorModal';
import { VendorCrudComponent } from './vendor-crud/vendor-crud.component';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit, AfterViewInit {
  vendors: VendorModal[] = [];
  dataSource: MatTableDataSource<VendorModal> = new MatTableDataSource(this.vendors);
  displayedColumns: string[] = ['name', 'city', 'state', 'gst_no', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getVendors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addVendor() {
    const dialogRef = this.dialog.open(VendorCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.added){
        this.getVendors();
      }
    });
  }

  getVendors() {
    this.vendors = [];
    this.loadingService.presentLoading("Fetching vendors...");
    this.afs.collection("vendors").get().subscribe((vendorsResp: any) => {
      vendorsResp.forEach(vnd => {
        var vTemp: VendorModal = vnd.data();
        vTemp.id = vnd.id;
        this.vendors.push(vTemp);
      });
      this.dataSource = new MatTableDataSource(this.vendors);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }

  editVendor(i) {
    const dialogRef = this.dialog.open(VendorCrudComponent, {
      width: '600px',
      data: this.vendors[i]
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.added){
        this.getVendors();
      }
    });
  }

  deleteVendor(i) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("vendors").doc(this.vendors[i].id).delete().then(response => {
          if (response == undefined) {
            this.getVendors();
            this.snackbar.open("Vendor deleted successfully!", "OK", { duration: 3000 });
          }
        });
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
