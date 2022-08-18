export class Produtos {
  id: number = 0;
  categoria_id: number = 0;
  nome: string = '';
  quantidade: number = 0;
  categoria: string = '';
  create_at: any;
  update_at: any;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
