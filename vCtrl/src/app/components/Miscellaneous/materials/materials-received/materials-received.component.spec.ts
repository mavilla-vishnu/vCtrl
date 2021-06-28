import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsReceivedComponent } from './materials-received.component';

describe('MaterialsReceivedComponent', () => {
  let component: MaterialsReceivedComponent;
  let fixture: ComponentFixture<MaterialsReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
