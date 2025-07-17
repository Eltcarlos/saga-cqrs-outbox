import { Customer } from "@order/domain/entity/Customer";

export abstract class CustomerRepository {
   abstract save(customer: Customer): Promise<Customer>;
   abstract findCustomer(customerId: string): Promise<Customer | null>;
}