export interface Identifiable {
  id: number;
}

export interface Describable {
  describe(): string;
}

function isDescribable(item: unknown): item is Describable {
  return typeof (item as Partial<Describable>).describe === 'function';
}

export class GenericStorage<T extends Identifiable> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  removeById(id: number): boolean {
    const index: number = this.items.findIndex((item: T) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  getById(id: number): T | undefined {
    return this.items.find((item: T) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  describeAll(): void {
    this.items.forEach((item: T) => {
      if (isDescribable(item)) {
        console.log(item.describe());
      } else {
        console.log(`Элемент id: ${item.id} не содержит описания.`);
      }
    });
  }
}

export class Product implements Identifiable, Describable {
  constructor(
    public readonly id: number,
    public name: string,
    public price: number,
  ) {}

  describe(): string {
    return `Product #${this.id}: ${this.name}, price: $${this.price}`;
  }
}

const productStorage = new GenericStorage<Product>();

productStorage.add(new Product(1, 'Ноутбук', 150000));
productStorage.add(new Product(2, 'Смартфон', 80000));
productStorage.add(new Product(3, 'Планшет', 50000));

console.log('--- Описание всех продуктов ---');
productStorage.describeAll();

productStorage.add({ id: 4 } as Product);
console.log('\n--- После добавления объекта без describe() ---');
productStorage.describeAll();

console.log('\n--- Остальные методы ---');
console.log('getById(2):', productStorage.getById(2)?.describe());
console.log('getById(10):', productStorage.getById(10));
console.log('removeById(3):', productStorage.removeById(3));
console.log('removeById(3) повторно:', productStorage.removeById(3));
console.log('getAll():', productStorage.getAll().map((p: Product) => p.id));

const copy: Product[] = productStorage.getAll();
copy.pop();
console.log('Изменение копии не трогает хранилище:', productStorage.getAll().length === 3);
