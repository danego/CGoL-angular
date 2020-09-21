import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stopPropo]'
})

export class StopPropoDirective {

  @HostListener('click', ['$event']) onClick(event?) {
    event.stopPropagation();
  }
  constructor() {}
}

