import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/core/modals/Product';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { ProductsCrudComponent } from './products-crud/products-crud.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['name', 'price', 'productDescription', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getProducts() {
    this.products = [];
    this.loadingService.presentLoading("Fetching products...")
    this.afs.collection("products").get().subscribe(products => {
      products.forEach((product: any) => {
        var materialTemp = product.data();
        materialTemp.id = product.id;
        this.products.push(materialTemp);
      });
      console.log(this.products);
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }

  editProduct(index) {
    const dialogRef = this.dialog.open(ProductsCrudComponent, {
      width: '600px',
      data: this.products[index]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getProducts();
      }
    });
  }

  deleteProduct(index) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("products").doc(this.products[index].id).delete().then(response => {
          if (undefined == undefined) {
            this.snackbar.open("Product deleted successfully!", "OK", { duration: 3000 });
            this.getProducts();
          }
        });
      }
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(ProductsCrudComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.added) {
        this.getProducts();
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
