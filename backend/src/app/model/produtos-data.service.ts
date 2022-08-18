import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SharedService } from '../shared/shared.service';
import { GlobalService } from './global.service';
import { ResponseBody } from './response-body';
import { Produtos } from './produtos';
import { ProdutosList } from './produtos-list';

@Injectable()
export class ProdutosDataService {
  constructor(private globalService: GlobalService, private http: HttpClient) { }


  // POST /v1/produtos
  addProdutos(produtos: Produtos): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .post<ResponseBody>(this.globalService.apiHost + '/produtos', JSON.stringify(produtos), {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // DELETE /v1/produtos/1
  deleteCategoriaById(id: number): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .delete<ResponseBody>(this.globalService.apiHost + '/produtos/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // PUT /v1/produtos/1
  updateProdutosById(produtos: Produtos): Observable<any> {
    const headers = GlobalService.getHeaders();

    return this.http
      .put<ResponseBody>(this.globalService.apiHost + '/produtos/' + produtos.id, JSON.stringify(produtos), {
        headers
      })
      .pipe(
        map(response => {
          return response;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/produtos
  getAllProdutos(extendedQueries?: any): Observable<ProdutosList> {
    const headers = GlobalService.getHeaders();

    let queries = {
      per_page: 10
    };
    if (extendedQueries) {
      queries = { ...queries, ...extendedQueries };
    }

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/produtos?' + SharedService.serializeQueryString(queries), {
        headers
      })
      .pipe(
        map(response => {
          return new ProdutosList(response.data);
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }

  // GET /v1/produtos/1
  getProdutosById(id: number): Observable<Produtos> {
    const headers = GlobalService.getHeaders();

    return this.http
      .get<ResponseBody>(this.globalService.apiHost + '/produtos/' + id, {
        headers
      })
      .pipe(
        map(response => {
          return response.data as Produtos;
        }),
        catchError(err => GlobalService.handleError(err))
      );
  }
}
