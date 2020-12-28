import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleModal } from 'src/app/core/modals/RoleModal/RoleModal';
import { LoadingService } from 'src/app/core/Services/loading.service';
import { DeleteConfirmationComponent } from 'src/app/partials/delete-confirmation/delete-confirmation.component';
import { RoleCrudComponent } from '../role-crud/role-crud.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, AfterViewInit {
  rolesArray: RoleModal[] = [];
  displayedColumns: string[] = ['roleName', 'roleDescription', 'actons'];
  dataSource: MatTableDataSource<RoleModal>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private afs: AngularFirestore, private loadingService: LoadingService, private snackbar: MatSnackBar) { }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.getRoles();
  }

  addRole() {
    const dialogRef = this.dialog.open(RoleCrudComponent, {
      width: '550px'
    });
  }

  getRoles() {
    this.rolesArray = [];
    this.loadingService.presentLoading("Fetching roles...");
    this.afs.collection("roles").valueChanges().subscribe((response: any) => {
      this.rolesArray = response;
      this.dataSource = new MatTableDataSource(this.rolesArray);
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

  editRole(role) {
    const dialogRef = this.dialog.open(RoleCrudComponent, {
      width: '550px',
      data: role
    });
  }

  deleteRole(role: RoleModal) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation) {
        this.afs.collection("roles").doc(role.id).delete().then(response => {
          if (undefined == undefined) {
            this.snackbar.open("Role deleted successfully!", "OK", { duration: 3000 });
          }
        });
      }
    });
  }

}
