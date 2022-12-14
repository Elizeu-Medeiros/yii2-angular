import map from 'lodash-es/map';
import { Pagination } from './pagination';
import { Categorias } from './categorias';

export class CategoriasList {
  rows: Categorias[] = [];
  pagination: Pagination = new Pagination();

  constructor(values: object = {}) {
    Object.assign(this, values);
    this.setRowNum();
  }

  setRowNum() {
    let rowNo = this.pagination.firstRowNo || 0;
    if (this.rows.length > 0) {
      map(this.rows, (row: any) => {
        row.row_num = rowNo--;
        return row;
      });
    }
  }
}
