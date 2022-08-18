import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { CategoriasFormComponent } from './categorias-form.component';
import { CategoriasListComponent } from './categorias-list.component';
import { CategoriasRoutingModule } from './categorias-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, CategoriasRoutingModule],
  declarations: [CategoriasListComponent, CategoriasFormComponent]
})
export class CategoriasModule { }
