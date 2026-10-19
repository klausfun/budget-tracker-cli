export function LogMethod(
  _target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    console.log(`Вызов метода ${propertyKey} с аргументами: ${JSON.stringify(args)}`);
    const result: unknown = originalMethod.apply(this, args);
    console.log(`Метод ${propertyKey} вернул: ${JSON.stringify(result)}`);
    return result;
  };

  return descriptor;
}
