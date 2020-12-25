import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleCrudComponent } from '../role-crud/role-crud.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addRole() {
    const dialogRef = this.dialog.open(RoleCrudComponent, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
