import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormcontrolsService {
  static max(max: number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {
      // tslint:disable-next-line:prefer-const
      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val <= max) {
        return null;
      }
      return { max: true };
    };
  }

  static min(min: number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {
      // tslint:disable-next-line:prefer-const
      let val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val >= min) {
        return null;
      }
      return { min: true };
    };
  }
  constructor() {}
  findInvalidControls(formGroup: FormGroup) {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
    // tslint:disable-next-line:prefer-const
    let invalidControls: string[] = [];
    const recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        // tslint:disable-next-line:curly
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }
  validateAllFormFields(formGroup: FormGroup) {
    //  {1}
    Object.keys(formGroup.controls).forEach(field => {
      //  {2}
      const control = formGroup.get(field);
      // console.log('Validating ===>> ' + field); //  {3}
      if (control instanceof FormArray) {
        for (const control1 of control.controls) {
          if (control1 instanceof FormControl) {
            control1.markAsTouched({
              onlySelf: true,
            });
          }
          if (control1 instanceof FormGroup) {
            this.validateAllFormFields(control1);
          }
        }
        // control.markAsTouched();
      }
      if (control instanceof FormControl) {
        // console.log('Validating instance of formcontrol ===>> ' + field); //  {4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // console.log('Validating instance of formgroup ===>> ' + field); //  {5}
        this.validateAllFormFields(control); //  {6}
      }
    });
  }
}
