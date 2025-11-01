
export class ObjectUpdater<T> {
  constructor(private obj: T) { }

  /**
   * Atualiza um campo aninhado do objeto gerenciado.
   * @param path O caminho do campo a ser atualizado, como um array de strings.
   * @param newValue O novo valor a ser atribuído.
   * @returns Uma nova instância do objeto com o campo atualizado.
   */
  updateNestedField(path: string, newValue: any): T {
    const update = (obj: any, path: string[], value: any): any => {
      if (path.length === 1) {
        return { ...obj, [path[0]]: value };
      }
      return {
        ...obj,
        [path[0]]: update(obj[path[0]] || {}, path.slice(1), value),
      };
    };

    return update(this.obj, path.split('.'), newValue);
  }
}
