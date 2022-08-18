import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

import { StaffService } from '../model/staff.service';
import { Produtos } from '../model/produtos';
import { ProdutosDataService } from '../model/produtos-data.service';

import forIn from 'lodash-es/forIn';
import moment from 'moment';
import { environment } from '../../environments/environment';
import { Categorias } from '../model/categorias';
import { CategoriasDataService } from '../model/categorias-data.service';

@Component({
  templateUrl: './produtos-form.component.html'
})
export class ProdutosFormComponent implements OnInit, OnDestroy {
  mode: string = '';

  id: number = 0;
  parameters: any = {};
  produtos: Produtos = new Produtos();

  errorMessage: string = '';

  form: FormGroup;
  formErrors: any;
  submitted: boolean = false;

  // Status Types
  statusTypes: any = {};

  constructor(
    private produtosDataService: ProdutosDataService,
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
          ]),
        ],
        quantidade: [''],
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
      quantidade: { valid: true, message: '' },
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

  resetProdutos() {
    this.produtos = new Produtos();
    this.produtos.nome = '';
    this.produtos.quantidade = '';
    this.produtos.create_at = '';
    this.produtos.update_at = '';
    this.setProdutosToForm();
  }

  ngOnInit() {
    this.resetFormErrors();
    this.resetProdutos();

    // _route is activated route service. this.route.params is observable.
    // subscribe is method that takes function to retrieve parameters when it is changed.
    this.parameters = this.activatedRoute.params.subscribe(params => {
      // plus(+) is to convert 'id' to number
      if (typeof params['id'] !== 'undefined') {
        this.id = Number.parseInt(params['id'], 10);
        this.errorMessage = '';
        this.produtosDataService.getProdutosById(this.id).subscribe(
          produtos => {
            this.produtos = produtos;
            this.setProdutosToForm();
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
    this.produtos = new Produtos();
  }

  onSubmit() {
    this.submitted = true;
    this.resetFormErrors();

    this.setFormToProdutos();

    if (this.mode === 'create') {
      this.produtosDataService.addProdutos(this.produtos).subscribe(
        result => {
          if (result.success) {
            this.router.navigate(['/produtos']);
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
      this.produtosDataService.updateProdutosById(this.produtos).subscribe(
        result => {
          if (result.success) {
            this.router.navigate(['/produtos']);
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

  private setProdutosToForm() {
    forIn(this.produtos, (value: any, key: string) => {
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

  private setFormToProdutos() {
    forIn(this.form.getRawValue(), (value: any, key: string) => {
      if (this.produtos.hasOwnProperty(key)) {
        if (key === 'confirmed_at' || key === 'blocked_at') {
          // if (moment.isMoment(value)) {
          //   this.produtos[key] = String(value.unix());
          // } else if (moment(value).isValid()) {
          //   this.produtos[key] = String(moment(value).unix());
          // } else {
          //   this.produtos[key] = '';
          // }
        } else {
          (this.produtos as any)[key] = value;
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


