// any[] здесь обязателен: TypeScript разрешает наследование от обобщённого
// конструктора только с сигнатурой (...args: any[]) (ошибка TS2545)
type Constructor = new (...args: any[]) => object;

export function LogClass<T extends Constructor>(constructor: T): T {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      console.log(`Создан экземпляр класса ${constructor.name} с аргументами: ${JSON.stringify(args)}`);
    }
  };
}
