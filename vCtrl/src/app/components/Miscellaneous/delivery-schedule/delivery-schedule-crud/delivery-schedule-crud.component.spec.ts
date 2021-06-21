import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryScheduleCrudComponent } from './delivery-schedule-crud.component';

describe('DeliveryScheduleCrudComponent', () => {
  let component: DeliveryScheduleCrudComponent;
  let fixture: ComponentFixture<DeliveryScheduleCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryScheduleCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryScheduleCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
