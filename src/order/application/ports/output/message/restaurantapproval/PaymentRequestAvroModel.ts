export class PaymentRequestAvroModel {
  constructor(
    public id: string,
    public sagaId: string,
    public customerId: string,
    public orderId: string,
    public price: number,
    public createdAt: Date,
    public paymentOrderStatus: PaymentOrderStatus
  ) {}
}

export enum PaymentOrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}
