
export class DomainException extends Error {
    constructor(public readonly message: string, protected readonly details?: string | object, protected readonly statusCode: number = 400) {
        super(message);
        this.emitError();
    }

    getStatus(): number {
        return this.statusCode;
    }

    getDetails():  object {
        return {
            details: this.details,
            message: this.message
        }
    }

    emitError(): void {
        console.log("Error emitted:", {
            message: this.message,
            details: this.details,
            statusCode: this.statusCode
        });
    }
}