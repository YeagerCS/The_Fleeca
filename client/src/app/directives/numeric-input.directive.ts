import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericInput]'
})
export class NumericInputDirective {

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, '');

    const decimalCount = (input.value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      input.value = input.value.slice(0, input.value.lastIndexOf('.'));
    }
  }
}
