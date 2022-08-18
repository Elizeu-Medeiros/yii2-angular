export class Categorias {
  id: number = 0;
  nome: string = '';
  create_at: any = '';
  update_at: any = '';

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
