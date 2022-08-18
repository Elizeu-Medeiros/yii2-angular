import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProdutosFormComponent } from './produtos-form.component';
import { ProdutosListComponent } from './produtos-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Produtos'
    },
    children: [
      {
        path: 'list',
        component: ProdutosListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        component: ProdutosFormComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: ':id',
        component: ProdutosFormComponent,
        data: {
          title: 'Update'
        }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutosRoutingModule { }
