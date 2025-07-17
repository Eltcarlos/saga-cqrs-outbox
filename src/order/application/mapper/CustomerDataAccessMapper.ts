import { Customer } from "@order/domain/entity/Customer";
import { CustomerEntity } from "@order/infrastructure/entity/Customer";
import { CustomerId } from "@shared/domain/value-object/CustomerId";

export class CustomerDataAccessMapper {

    customerEntityToCustomer(customerEntity: CustomerEntity): Customer {
        return new Customer(
            new CustomerId(customerEntity.getId()),
            customerEntity.getUsername(),
            customerEntity.getFirstName(),
            customerEntity.getLastName()
        );
    }

    customerToCustomerEntity(customer: Customer): CustomerEntity {
        return new CustomerEntity(
            customer.getId().getValue(),
            customer.getUsername(),
            customer.getFirstName(),
            customer.getLastName()
        );
    }
}