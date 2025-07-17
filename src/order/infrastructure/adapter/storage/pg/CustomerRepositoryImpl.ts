import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerDataAccessMapper } from "@order/application/mapper/CustomerDataAccessMapper";
import { CustomerRepository } from "@order/application/ports/output/repository/CustomerRepository";
import { Customer } from "@order/domain/entity/Customer";
import { CustomerEntity } from "@order/infrastructure/entity/Customer";
import { Repository } from "typeorm";

@Injectable()
export class CustomerRepositoryImpl implements CustomerRepository {

    constructor(
        @InjectRepository(CustomerEntity)
        private readonly repository: Repository<CustomerEntity>,
        private readonly customerDataAccessMapper: CustomerDataAccessMapper
    ) { }

    async save(customer: Customer): Promise<Customer> {
        return this.customerDataAccessMapper.customerEntityToCustomer(await this.repository.save(this.customerDataAccessMapper.customerToCustomerEntity(customer)))
    }

    async findCustomer(customerId: string): Promise<Customer | null> {
        const customerEntity = await this.repository.findOne({
            where: { id: customerId }
        });
        if (!customerEntity) {
            return null;
        }
        return this.customerDataAccessMapper.customerEntityToCustomer(customerEntity);
    }

}