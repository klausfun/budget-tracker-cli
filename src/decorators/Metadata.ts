import 'reflect-metadata';

export function Metadata(key: string, value: unknown) {
  return function (target: object, propertyKey: string): void {
    Reflect.defineMetadata(key, value, target, propertyKey);
  };
}

export function getPropertyMetadata<T>(key: string, target: object, propertyKey: string): T | undefined {
  return Reflect.getMetadata(key, target, propertyKey) as T | undefined;
}
