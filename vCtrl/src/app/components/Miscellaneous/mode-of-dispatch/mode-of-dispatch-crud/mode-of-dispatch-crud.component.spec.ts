import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfDispatchCrudComponent } from './mode-of-dispatch-crud.component';

describe('ModeOfDispatchCrudComponent', () => {
  let component: ModeOfDispatchCrudComponent;
  let fixture: ComponentFixture<ModeOfDispatchCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeOfDispatchCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeOfDispatchCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
