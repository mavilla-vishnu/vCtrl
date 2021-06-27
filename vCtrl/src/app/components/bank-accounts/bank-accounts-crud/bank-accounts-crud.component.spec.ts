import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountsCrudComponent } from './bank-accounts-crud.component';

describe('BankAccountsCrudComponent', () => {
  let component: BankAccountsCrudComponent;
  let fixture: ComponentFixture<BankAccountsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountsCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
