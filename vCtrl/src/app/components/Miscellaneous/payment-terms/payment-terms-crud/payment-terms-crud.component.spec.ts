import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTermsCrudComponent } from './payment-terms-crud.component';

describe('PaymentTermsCrudComponent', () => {
  let component: PaymentTermsCrudComponent;
  let fixture: ComponentFixture<PaymentTermsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTermsCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTermsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
