import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModal } from 'src/app/core/modals/MaterialModal';
import { MaterialTimeLine } from 'src/app/core/modals/MaterialTimeLine';

@Component({
  selector: 'app-material-timeline',
  templateUrl: './material-timeline.component.html',
  styleUrls: ['./material-timeline.component.scss']
})
export class MaterialTimelineComponent implements OnInit {
  timeLineArray: MaterialTimeLine[]=[];
  constructor(@Inject(MAT_DIALOG_DATA) public materials: MaterialModal) { }

  ngOnInit(): void {
    this.timeLineArray=this.materials.timeline;
  }

}
