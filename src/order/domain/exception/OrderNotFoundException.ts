import { DomainException } from "@shared/domain/exception/DomainException";

export class OrderNotFoundException extends DomainException {
    constructor(message: string, details?: string | object, statusCode: number = 404) {
        super(message, details, statusCode);
    }
}