import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderCrudComponent } from './purchaseorder-crud.component';

describe('PurchaseorderCrudComponent', () => {
  let component: PurchaseorderCrudComponent;
  let fixture: ComponentFixture<PurchaseorderCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseorderCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseorderCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
