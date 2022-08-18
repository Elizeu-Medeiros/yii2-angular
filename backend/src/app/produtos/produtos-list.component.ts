import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { StaffService } from '../model/staff.service';
import { Produtos } from '../model/produtos';
import { ProdutosDataService } from '../model/produtos-data.service';
import { ProdutosList } from '../model/produtos-list';

@Component({
  templateUrl: './produtos-list.component.html'
})
export class ProdutosListComponent implements OnInit {
  produtosList: ProdutosList | null;
  errorMessage: string;

  loading: boolean;
  searchParams: any;
  totalCount: number;
  currentPage: number;
  pageSize: number;

  constructor(
    private produtosDataService: ProdutosDataService,
    private staffService: StaffService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.produtosList = null;
    this.errorMessage = '';

    this.loading = false;
    this.searchParams = {};
    this.totalCount = 0;
    this.currentPage = 0;
    this.pageSize = 0;

    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.currentPage = typeof queryParams['page'] !== 'undefined' ? +queryParams['page'] : 1;

    // Load search params
    this.searchParams = {};

    // Override page
    this.searchParams.page = this.currentPage;

    if (typeof queryParams['q'] !== 'undefined') {
      this.searchParams.q = queryParams['q'] + '';
    }
  }

  onSearchFormSubmit() {
    this.searchParams.page = 1;
    this.currentPage = 1;
    this.getProdutos();
  }

  /**
   * Clear search params
   */
  clearSearchParams() {
    // Load search params
    this.searchParams = {};

    this.getProdutos();
  }

  /**
   * Handle page changed from pagination
   *
   * @param event
   */
  pageChanged(event: any): void {
    if (event.page !== this.currentPage) {
      this.currentPage = event.page;
      this.searchParams.page = this.currentPage;

      this.getProdutos();
    }
  }

  ngOnInit() {
    this.getProdutos();
  }

  public getProdutos() {
    this.produtosList = null;
    this.loading = true;

    this.router.navigate([], { queryParams: this.searchParams });

    this.produtosDataService.getAllProdutos(this.searchParams).subscribe(
      produtosList => {
        this.produtosList = produtosList;
        this.totalCount = this.produtosList.pagination.totalCount || 0;
        this.pageSize = this.produtosList.pagination.defaultPageSize || 0;
        this.loading = false;
      },
      error => {
        // unauthorized access
        if (error.status === 401 || error.status === 403) {
          this.staffService.unauthorizedAccess(error);
        } else {
          this.errorMessage = error.data.message;
        }
        this.loading = false;
      }
    );
  }

  public viewProdutos(produtos: Produtos): void {
    this.router.navigate(['/produtos', produtos.id]);
  }

  public confirmDeleteProdutos(produtos: Produtos): void {
    // Due to sweet alert scope issue, define as function variable and pass to swal

    // tslint:disable-next-line: no-this-assignment
    const parent = this;
    // let getProdutoss = this.getProdutoss;
    this.errorMessage = '';

    Swal.fire({
      title: 'Tem certeza?',
      text: "Depois de excluir, você não poderá reverter isso!",
      icon: 'question',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, exclua!',
      preConfirm() {
        parent.loading = true;
        return new Promise(resolve => {
          parent.produtosDataService.deleteCategoriaById(produtos.id).subscribe(
            _result => {
              parent.getProdutos();
              parent.loading = false;
              resolve(true);
            },
            error => {
              // unauthorized access
              if (error.status === 401 || error.status === 403) {
                parent.staffService.unauthorizedAccess(error);
              } else {
                parent.errorMessage = error.data.message;
              }
              parent.loading = false;
              resolve(true);
            }
          );
        });
      }
    });
  }
}
