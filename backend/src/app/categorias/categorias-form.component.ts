import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

import { StaffService } from '../model/staff.service';
import { Categorias } from '../model/categorias';
import { CategoriasDataService } from '../model/categorias-data.service';

import forIn from 'lodash-es/forIn';
import moment from 'moment';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './categorias-form.component.html'
})
export class CategoriasFormComponent implements OnInit, OnDestroy {
  mode: string = '';

  id: number = 0;
  parameters: any = {};
  categorias: Categorias = new Categorias();

  errorMessage: string = '';

  form: FormGroup;
  formErrors: any;
  submitted: boolean = false;

  // Status Types
  statusTypes: any = {};

  constructor(
    private categoriasDataService: CategoriasDataService,
    private staffService: StaffService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    // Construct form group
    this.form = formBuilder.group(
      {
        nome: [
          '',
          Validators.compose([
            Validators.required,
            CustomValidators.rangeLength([3, 15]),
            Validators.pattern('^[A-Za-z0-9_-]{3,15}$')
          ])
        ]
      },
      {
        validator: validateDateTime(['confirmed_at', 'blocked_at'])
      }
    );

    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  setFormErrors(errorFields: any): void {
    for (const key in errorFields) {
      // skip loop if the property is from prototype
      if (!errorFields.hasOwnProperty(key)) {
        continue;
      }

      this.formErrors[key].valid = false;
      this.formErrors[key].message = errorFields[key];
    }
  }

  setFormField(field: string, value: any) {
    this.form.controls[field].setValue(value);
  }

  resetFormErrors(): void {
    this.formErrors = {
      nome: { valid: true, message: '' },

    };
  }

  isValid(field: string): boolean {
    let isValid: boolean = false;

    // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
    if (this.form.controls[field].touched === false) {
      isValid = true;
    } else if (this.form.controls[field].touched === true && this.form.controls[field].valid === true) {
      // If the field is touched and valid value, then it is considered as valid.
      isValid = true;
    }

    return isValid;
  }

  onValueChanged(_data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (const field of Object.keys(this.formErrors)) {
      // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty) {
        this.formErrors[field].valid = true;
        this.formErrors[field].message = '';
      }
    }
  }

  resetCategorias() {
    this.categorias = new Categorias();
    this.categorias.nome = '';
    this.categorias.create_at = '';
    this.categorias.update_at = '';
    this.setCategoriasToForm();
  }

  ngOnInit() {
    this.resetFormErrors();
    this.resetCategorias();

    // _route is activated route service. this.route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this.parameters = this.activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if (typeof params['id'] !== 'undefined') {
        this.id = Number.parseInt(params['id'], 10);
        this.errorMessage = '';
        this.categoriasDataService.getCategoriasById(this.id).subscribe(
          categorias => {
            this.categorias = categorias;
            this.setCategoriasToForm();
            this.mode = 'update';
          },
          error => {
            // unauthorized access
            if (error.status === 401 || error.status === 403) {
              this.staffService.unauthorizedAccess(error);
            } else {
              this.errorMessage = error.data.message;
            }
          }
        );
      } else {
        this.mode = 'create';
      }
    });
  }

  ngOnDestroy() {
    this.parameters.unsubscribe();
    this.categorias = new Categorias();
  }

  onSubmit() {
    this.submitted = true;
    this.resetFormErrors();

    this.setFormToCategorias();

    if (this.mode === 'create') {
      this.categoriasDataService.addCategorias(this.categorias).subscribe(
        result => {
          if (result.success) {
            this.router.navigate(['/categorias']);
          } else {
            this.submitted = false;
          }
        },
        error => {
          this.submitted = false;
          // Validation errors
          if (error.status === 422) {
            this.setFormErrors(JSON.parse(error.data.message));
          } else if (error.status === 401 || error.status === 403) {
            // Unauthorized Access
            this.staffService.unauthorizedAccess(error);
          } else {
            // All other errors
            this.errorMessage = error.data.message;
          }
        }
      );
    } else if (this.mode === 'update') {
      this.categoriasDataService.updateCategoriasById(this.categorias).subscribe(
        result => {
          if (result.success) {
            this.router.navigate(['/categorias']);
          } else {
            this.submitted = false;
          }
        },
        error => {
          this.submitted = false;
          // Validation errors
          if (error.status === 422) {
            this.setFormErrors(JSON.parse(error.data.message));
          } else if (error.status === 401 || error.status === 403) {
            // Unauthorized Access
            this.staffService.unauthorizedAccess(error);
          } else {
            // All other errors
            this.errorMessage = error.data.message;
          }
        }
      );
    }
  }

  private setCategoriasToForm() {
    forIn(this.categorias, (value: any, key: string) => {
      if (typeof this.form.controls[key] !== 'undefined') {
        if (key === 'confirmed_at' || key === 'blocked_at') {
          if (value === null || value === '') {
            this.form.controls[key].setValue('');
          } else if (moment.isMoment(value)) {
            this.form.controls[key].setValue(value.format(environment.customDateTimeFormat.apiFormat));
          } else if (moment.unix(value).isValid()) {
            this.form.controls[key].setValue(new Date(moment.unix(value).format('YYYY-MM-DD HH:mm:ss')));
          } else {
            this.form.controls[key].setValue('');
          }
        } else {
          this.form.controls[key].setValue(value);
        }
      }
    });
  }

  private setFormToCategorias() {
    forIn(this.form.getRawValue(), (value: any, key: string) => {
      if (this.categorias.hasOwnProperty(key)) {
        if (key === 'confirmed_at' || key === 'blocked_at') {
          // if (moment.isMoment(value)) {
          //   this.categorias[key] = String(value.unix());
          // } else if (moment(value).isValid()) {
          //   this.categorias[key] = String(moment(value).unix());
          // } else {
          //   this.categorias[key] = '';
          // }
        } else {
          (this.categorias as any)[key] = value;
        }
      }
    });
  }
}

function validateDateTime(fieldKeys: any) {
  return (group: FormGroup) => {
    for (const fieldKey of fieldKeys) {
      const field = group.controls[fieldKey];
      if (typeof field !== 'undefined' && field.value !== '' && field.value !== null) {
        if (moment(field.value, environment.customDateTimeFormat.parseInput, false).isValid() === false) {
          return field.setErrors({ validateDateTime: true });
        }
      }
    }
  };
}
