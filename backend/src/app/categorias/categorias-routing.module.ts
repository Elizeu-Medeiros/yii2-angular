import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriasFormComponent } from './categorias-form.component';
import { CategoriasListComponent } from './categorias-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Categorias'
    },
    children: [
      {
        path: 'list',
        component: CategoriasListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        component: CategoriasFormComponent,
        data: {
          title: 'Create'
        }
      },
      {
        path: ':id',
        component: CategoriasFormComponent,
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
export class CategoriasRoutingModule { }
