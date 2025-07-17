export class Money {
    private readonly amount: number;
    public static readonly ZERO = new Money(0);

    constructor(amount: number) {
        this.amount = amount;
    }

    isGreaterThanZero(): boolean {
        return this.amount != null && this.amount > 0;
    }

    isGreaterThan(money: Money): boolean {
        return this.amount != null && money.amount != null && this.amount > money.amount;
    }

    getAmount(): number {
        return this.amount;
    }

    add(money: Money): Money {
        return new Money(this.setScale(this.amount + money.getAmount()));
    }

    subtract(money: Money): Money {
        return new Money(this.setScale(this.amount - money.getAmount()));
    }

    multiply(factor: number): Money {
        return new Money(this.setScale(this.amount * factor));
    }

    setScale(input: number) {
        return input.toFixed(2) === '0.00' ? 0 : parseFloat(input.toFixed(2));
    }

    equals(money: Money): boolean {
        return this.amount != null && money.amount != null && this.amount === money.amount;
    }
}