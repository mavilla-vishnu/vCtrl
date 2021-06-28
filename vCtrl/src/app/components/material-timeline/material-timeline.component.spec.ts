import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTimelineComponent } from './material-timeline.component';

describe('MaterialTimelineComponent', () => {
  let component: MaterialTimelineComponent;
  let fixture: ComponentFixture<MaterialTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
