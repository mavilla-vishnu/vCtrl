import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BranchModal } from 'src/app/core/modals/BranchModal';
import { RoleModal } from 'src/app/core/modals/RoleModal/RoleModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { BranchesCRUDComponent } from '../branches-crud/branches-crud.component';


@Component({
  selector: 'app-branches-list',
  templateUrl: './branches-list.component.html',
  styleUrls: ['./branches-list.component.scss']
})
export class BranchesListComponent implements OnInit {
  branchArray: BranchModal[] = [];
  displayedColumns: string[] = ['branchName', 'branchGstin', 'actons'];
  dataSource: MatTableDataSource<BranchModal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getBranches();
  }

  addBranch() {
    const dialogRef = this.dialog.open(BranchesCRUDComponent, {
      width: '550px'
    });
  }

  getBranches() {
    this.branchArray = [];
    this.loadingService.presentLoading("Fetching branches...");
    this.afs.collection("branches").valueChanges().subscribe((response: any) => {
      this.branchArray = response;
      this.dataSource = new MatTableDataSource(this.branchArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadingService.dismissLoading();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editBranch(branch) {
    const dialogRef = this.dialog.open(BranchesCRUDComponent, {
      width: '550px',
      data: branch
    });
  }

  deleteBranch(branch) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("branches").doc(branch.id).delete().then(response => {
          if (response == undefined) {
            this.snackbar.open("Branch deleted successfully!", "OK", { duration: 3000 });
          }
        });
      }
    });
  }

}
