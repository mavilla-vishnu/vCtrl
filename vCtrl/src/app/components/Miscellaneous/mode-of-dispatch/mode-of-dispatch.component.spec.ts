import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfDispatchComponent } from './mode-of-dispatch.component';

describe('ModeOfDispatchComponent', () => {
  let component: ModeOfDispatchComponent;
  let fixture: ComponentFixture<ModeOfDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeOfDispatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeOfDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
