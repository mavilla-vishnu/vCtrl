import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityPickComponent } from './quantity-pick.component';

describe('QuantityPickComponent', () => {
  let component: QuantityPickComponent;
  let fixture: ComponentFixture<QuantityPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantityPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
