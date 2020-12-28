import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapialiseText]'
})
export class CapialiseTextDirective {

  constructor(private el: ElementRef) {
  }


  @HostListener('keyup') onKeyDown() {
    if (this.el.nativeElement.value) {
      this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
    }
  }
}
