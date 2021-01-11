import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { RoleModal } from '../modals/RoleModal/RoleModal';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor(private afs: AngularFirestore) { }

  getRoles() {
    return new Promise((resolve, reject) => {
      this.afs.collection('roles').get().subscribe(response => {
        resolve(response.docs.map(doc => doc.data()));
      }, error => {
        reject(error);
      })
    });
  }

  getDepartments() {
    return new Promise((resolve, reject) => {
      this.afs.collection('departments').get().subscribe(response => {
        resolve(response.docs.map(doc => doc.data()));
      }, error => {
        reject(error);
      })
    });
  }

  getDesignations() {
    return new Promise((resolve, reject) => {
      this.afs.collection('designations').get().subscribe(response => {
        resolve(response.docs.map(doc => doc.data()));
      }, error => {
        reject(error);
      })
    });
  }

  getBranches(){
    return new Promise((resolve, reject) => {
      this.afs.collection('branches').get().subscribe(response => {
        resolve(response.docs.map(doc => doc.data()));
      }, error => {
        reject(error);
      })
    });
  }
}
