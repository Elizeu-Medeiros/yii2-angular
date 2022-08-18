import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SharedService } from '../shared/shared.service';
import { GlobalService } from './global.service';
import { ResponseBody } from './response-body';
import { Categorias } from './categorias';
import { CategoriasList } from './categorias-list';

@Injectable()
export class CategoriasDataService {
  constructor(private globalService: GlobalService, private http: HttpClient) { }


  // POST /v1/categorias
  addCategorias(categorias: Categorias): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(this.globalService.apiHost + '/categorias', JSON.stringify(categorias), {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // DELETE /v1/categorias/1
  deleteCategoriaById(id: number): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/categorias/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // PUT /v1/categorias/1
  updateCategoriasById(categorias: Categorias): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(this.globalService.apiHost + '/categorias/' + categorias.id, JSON.stringify(categorias), {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/categorias
  getAllCategorias(extendedQueries?: any): Observable<CategoriasList> {
    const headers = GlobalService.getHeaders();

    let queries = {
      per_page: 10
    };
    if (extendedQueries) {
      queries = { ...queries, ...extendedQueries };
    }

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/categorias?' + SharedService.serializeQueryString(queries), {
        headers
      })
      .pipe(
        map(response => {
          return new CategoriasList(response.data);
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/categorias/1
  getCategoriasById(id: number): Observable<Categorias> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/categorias/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response.data as Categorias;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }
}
