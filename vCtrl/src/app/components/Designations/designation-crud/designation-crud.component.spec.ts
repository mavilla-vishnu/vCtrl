import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationCrudComponent } from './designation-crud.component';

describe('DesignationCrudComponent', () => {
  let component: DesignationCrudComponent;
  let fixture: ComponentFixture<DesignationCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
