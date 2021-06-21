import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyCrudComponent } from './warranty-crud.component';

describe('WarrantyCrudComponent', () => {
  let component: WarrantyCrudComponent;
  let fixture: ComponentFixture<WarrantyCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarrantyCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
