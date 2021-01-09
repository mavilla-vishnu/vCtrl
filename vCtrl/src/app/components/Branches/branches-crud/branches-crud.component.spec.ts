import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesCRUDComponent } from './branches-crud.component';

describe('BranchesCRUDComponent', () => {
  let component: BranchesCRUDComponent;
  let fixture: ComponentFixture<BranchesCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchesCRUDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
