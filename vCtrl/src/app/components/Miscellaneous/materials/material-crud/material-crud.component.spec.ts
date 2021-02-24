import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCrudComponent } from './material-crud.component';

describe('MaterialCrudComponent', () => {
  let component: MaterialCrudComponent;
  let fixture: ComponentFixture<MaterialCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
