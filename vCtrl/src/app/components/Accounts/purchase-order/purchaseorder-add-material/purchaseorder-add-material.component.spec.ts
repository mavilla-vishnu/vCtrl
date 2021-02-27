import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderAddMaterialComponent } from './purchaseorder-add-material.component';

describe('PurchaseorderAddMaterialComponent', () => {
  let component: PurchaseorderAddMaterialComponent;
  let fixture: ComponentFixture<PurchaseorderAddMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseorderAddMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseorderAddMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
