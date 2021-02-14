import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from 'src/app/partials/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  dialogRef: MatDialogRef<LoadingComponent>;
  constructor(public dialog: MatDialog) { }

  presentLoading(message: string) {
    this.dialogRef = this.dialog.open(LoadingComponent, {
      width: '300px',
      data: { message: message }
    });
  }

  dismissLoading() {
    this.dialogRef.close();
  }
}
