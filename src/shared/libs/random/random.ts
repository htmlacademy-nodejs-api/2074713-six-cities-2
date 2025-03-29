import { RandomItemsOptions } from './random-items-options.type.js';

const INTEGER_PRECISION = 0;

export class Random {
  public static getBoolean(): boolean {
    return Math.random() > 0.5;
  }

  public static getNumberFromRange(
    min: number,
    max: number,
    fractionPrecision = INTEGER_PRECISION
  ): number {
    return +(Math.random() * (max - min) + min).toFixed(fractionPrecision);
  }

  public static getItem<Item>(items: Item[]): Item {
    return items[this.getIndex(items)];
  }

  public static extractItem<Item>(items: Item[]): Item {
    return items.splice(this.getIndex(items), 1)[0];
  }

  public static getUniqueItems<Item>(
    items: Item[],
    options?: RandomItemsOptions
  ): Item[] {
    const itemsCopy = [...items];
    const uniqueItems = [];
    const uniqueItemsQuantity =
      options?.quantity ||
      this.getNumberFromRange(
        options?.minQuantity || 0,
        options?.maxQuantity || items.length
      );

    while (uniqueItems.length < uniqueItemsQuantity) {
      uniqueItems.push(this.extractItem(itemsCopy));
    }

    return uniqueItems;
  }

  private static getIndex(items: unknown[]): number {
    return this.getNumberFromRange(0, items.length - 1);
  }
}
