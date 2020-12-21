import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  message: string;
  constructor(public dialogRef: MatDialogRef<LoadingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

  ngOnInit(): void {
    this.message = this.data.message;
  }

}
