/**
 * A class to handle money operations, ensuring precision and safety.
 * Internally, this class handles amounts in cents to avoid floating-point issues.
 */
export class Money {
  private readonly valueInCents: number;
  private readonly currency: string;

  /**
   * Create a new Money instance.
   * @param {string | number | Money} value - The monetary value
   * @param {string} currency - The currency code (e.g., 'USD', 'EUR', 'BRL')
   * @param {Object} [options] - Options for the constructor
   * @param {boolean} [options.isCents=false] - If true, the value is treated as cents
   */
  constructor(value: string | number | Money, currency: string, options: { isCents?: boolean } = {}) {
    const { isCents = false } = options;

    if (value instanceof Money) {
      if (value.currency !== currency) {
        throw new Error('Cannot create Money instance with different currencies');
      }
      this.valueInCents = value.getInCents();
      this.currency = currency;
    } else {
      const parsedValue = this.parseToNumber(value);
      this.valueInCents = isCents
        ? Math.round(parsedValue)
        : Math.round(parsedValue * 100);
      this.currency = currency.toUpperCase();
    }
  }

  /**
   * Parse and validate the input to ensure it's a valid number.
   * @param {string | number} value - The value to parse and validate
   * @returns {number} - The parsed number
   * @throws {Error} - Throws an error if the input is invalid
   */
  private parseToNumber(value: string | number): number {
    const parsed = parseFloat(value.toString().replace(",", "."));
    if (isNaN(parsed)) {
      throw new Error(`Invalid monetary value: ${value}`);
    }
    return parsed;
  }

  /**
   * Get the value in cents
   * @returns {number} - The value in cents
   */
  getInCents(): number {
    return this.valueInCents;
  }

  /**
   * Get the value in the main currency unit
   * @returns {number} - The value in the main currency unit
   */
  getAmount(): number {
    return this.valueInCents / 100;
  }

  /**
   * Get the currency code
   * @returns {string} - The currency code
   */
  getCurrency(): string {
    return this.currency;
  }

  /**
   * Format the money value with proper currency symbol and decimal places
   * @returns {string} - Formatted string representation
   */
  format(): string {
    const amount = this.getAmount();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Add another monetary value
   * @param {Money} amount - The amount to add
   * @returns {Money} - A new Money instance with the sum
   * @throws {Error} - If currencies don't match
   */
  add(amount: Money): Money {
    if (this.currency !== amount.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.valueInCents + amount.getInCents(), this.currency, { isCents: true });
  }

  /**
   * Subtract a monetary value
   * @param {Money} amount - The amount to subtract
   * @returns {Money} - A new Money instance with the difference
   * @throws {Error} - If currencies don't match
   */
  subtract(amount: Money): Money {
    if (this.currency !== amount.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(this.valueInCents - amount.getInCents(), this.currency, { isCents: true });
  }

  /**
   * Multiply the current value by a multiplier
   * @param {number} multiplier - The multiplier to apply
   * @returns {Money} - A new Money instance with the multiplied value
   */
  multiply(multiplier: number): Money {
    const multipliedValue = Math.round(this.valueInCents * multiplier);
    return new Money(multipliedValue, this.currency, { isCents: true });
  }

  /**
   * Divide the current value by a divisor
   * @param {number} divisor - The divisor to apply
   * @returns {Money} - A new Money instance with the divided value
   * @throws {Error} - If divisor is zero
   */
  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    const dividedValue = Math.round(this.valueInCents / divisor);
    return new Money(dividedValue, this.currency, { isCents: true });
  }

  /**
   * Calculate a percentage of the current value
   * @param {number} percentage - The percentage to calculate
   * @returns {Money} - A new Money instance with the percentage value
   */
  percentage(percentage: number): Money {
    return this.multiply(percentage / 100);
  }

  /**
   * Compare if the current Money instance is equal to another
   * @param {Money} other - The value to compare with
   * @returns {boolean} - Returns true if values are equal
   * @throws {Error} - If currencies don't match
   */
  isEqualTo(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.valueInCents === other.getInCents();
  }

  /**
   * Compare if the current Money instance is greater than another
   * @param {Money} other - The value to compare with
   * @returns {boolean} - Returns true if the current value is greater
   * @throws {Error} - If currencies don't match
   */
  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.valueInCents > other.getInCents();
  }

  /**
   * Compare if the current Money instance is less than another
   * @param {Money} other - The value to compare with
   * @returns {boolean} - Returns true if the current value is less
   * @throws {Error} - If currencies don't match
   */
  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.valueInCents < other.getInCents();
  }

  /**
   * Check if the amount is zero
   * @returns {boolean} - Returns true if the amount is zero
   */
  isZero(): boolean {
    return this.valueInCents === 0;
  }

  /**
   * Check if the amount is positive
   * @returns {boolean} - Returns true if the amount is positive
   */
  isPositive(): boolean {
    return this.valueInCents > 0;
  }

  /**
   * Check if the amount is negative
   * @returns {boolean} - Returns true if the amount is negative
   */
  isNegative(): boolean {
    return this.valueInCents < 0;
  }

  /**
   * Get the absolute value of the amount
   * @returns {Money} - A new Money instance with the absolute value
   */
  abs(): Money {
    return new Money(Math.abs(this.valueInCents), this.currency, { isCents: true });
  }

  /**
   * Round the amount to the nearest whole number
   * @returns {Money} - A new Money instance with the rounded value
   */
  round(): Money {
    return new Money(Math.round(this.valueInCents / 100) * 100, this.currency);
  }

  /**
   * Create a Money instance from cents
   * @param {number} cents - The amount in cents
   * @param {string} currency - The currency code
   * @returns {Money} - A new Money instance
   */
  static fromCents(cents: number, currency: string): Money {
    return new Money(cents, currency, { isCents: true });
  }

  /**
   * Create a Money instance from the main currency unit
   * @param {number} amount - The amount in the main currency unit
   * @param {string} currency - The currency code
   * @returns {Money} - A new Money instance
   */
  static fromAmount(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  /**
   * Create a zero Money instance
   * @param {string} currency - The currency code
   * @returns {Money} - A new Money instance with zero value
   */
  static zero(currency: string): Money {
    return new Money(0, currency, { isCents: true });
  }
} 