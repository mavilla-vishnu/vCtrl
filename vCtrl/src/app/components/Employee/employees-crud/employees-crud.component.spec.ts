import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesCRUDComponent } from './employees-crud.component';

describe('EmployeesCRUDComponent', () => {
  let component: EmployeesCRUDComponent;
  let fixture: ComponentFixture<EmployeesCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesCRUDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
