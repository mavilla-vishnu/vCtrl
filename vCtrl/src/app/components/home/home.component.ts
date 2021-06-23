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
  isMenuMainExpanded = true;
  subMenu: SideMenuModal[] = [
    {
      title: "Organisation",
      icon: "account_balance",
      url: "",
      children: [
        { title: "Roles", url: "roles" },
        { title: "Departments", url: "departments" },
        { title: "Designations", url: "designations" },
        { title: "Branches", url: "branches" },
        {title: "Products", url: "products"}
      ],
      isExpanded: false,
      showSubmenu: false,
      isShowing: true,
      showSubSubMenu: true
    }, {
      title: "Employees",
      icon: "person",
      url: "/employees",
      children: [
        { title: "Employees", url: "employees" },
      ],
      isExpanded: false,
      showSubmenu: false,
      isShowing: true,
      showSubSubMenu: true
    }, {
      title: "Accounts",
      icon: "monetization_on",
      url: "",
      children: [
        { title: "Purchase Order", url: "po" },
        { title: "Sale Order", url: "so" },
      ],
      isExpanded: false,
      showSubmenu: false,
      isShowing: true,
      showSubSubMenu: true
    }, {
      title: "Miscellaneous",
      icon: "bubble_chart",
      url: "",
      children: [
        { title: "Materials", url: "materials" },
        { title: "Vendors", url: "vendors" },
        { title: "Customers", url: "customers" },
        { title: "Mode of dispatch", url: "mod" },
        { title: "Payment terms", url: "paymentTerms" },
        { title: "Warranty", url: "warranty" },
        { title: "Delivery schedule", url: "deliverySchedule" },
      ],
      isExpanded: false,
      showSubmenu: false,
      isShowing: true,
      showSubSubMenu: true
    }
  ];

  constructor(private auth: AngularFireAuth, private router: Router, private afs: AngularFirestore) { }

  // mouseenter() {
  //   if (!this.isExpanded) {
  //     this.isShowing = true;
  //   }
  // }

  // mouseleave() {
  //   if (!this.isExpanded) {
  //     this.isShowing = false;
  //   }
  // }

  ngOnInit(): void {
    this.getSideMenu();
  }

  logout() {
    this.auth.signOut();
    this.router.navigateByUrl("/login");
  }

  getSideMenu() {
    // this.afs.collection("menu").get().subscribe(menu => {
    //   var data = menu.docs[0].data();
    //   var temp = data["menuList"];
    //   this.subMenu = temp;
    //   console.log(this.subMenu);
    // });
  }

}
