// Логи декораторов включаются переменной окружения BUDGET_DEBUG=1,
// чтобы не засорять интерактивное меню при обычной работе
export function isDecoratorLoggingEnabled(): boolean {
  return process.env.BUDGET_DEBUG === '1';
}

export function LogMethod(
  _target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const log: boolean = isDecoratorLoggingEnabled();
    if (log) {
      console.log(`Вызов метода ${propertyKey} с аргументами: ${JSON.stringify(args)}`);
    }
    const result: unknown = originalMethod.apply(this, args);
    if (log) {
      console.log(`Метод ${propertyKey} вернул: ${JSON.stringify(result)}`);
    }
    return result;
  };

  return descriptor;
}
