import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { title } from 'process';
import { SideMenuModal } from 'src/app/core/modals/SideMenuModal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  subMenu: SideMenuModal[] = [
    {
      title: "Organisation",
      icon: "building",
      url: "",
      children: [
        { title: "Roles", url: "roles" },
        { title: "Departments", url: "departments" },
        { title: "Designations", url: "designations" },
      ]
    }, {
      title: "Employees",
      icon: "person",
      url: "/employees",
      children: []
    },
  ];

  constructor(private auth: AngularFireAuth, private router: Router, private afs: AngularFirestore) { }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  ngOnInit(): void {
    this.getSideMenu();
  }

  logout() {
    this.auth.signOut();
    this.router.navigateByUrl("/login");
  }

  getSideMenu() {
    this.afs.collection("menu").get().subscribe(menu => {
      var data = menu.docs[0].data();
      var temp = data["menuList"];
      this.subMenu = temp;
      console.log(this.subMenu);
    });
  }

}
