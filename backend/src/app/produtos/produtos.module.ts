import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProdutosFormComponent } from './produtos-form.component';
import { ProdutosListComponent } from './produtos-list.component';
import { ProdutosRoutingModule } from './produtos-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, ProdutosRoutingModule],
  declarations: [ProdutosListComponent, ProdutosFormComponent]
})
export class ProdutosModule { }
