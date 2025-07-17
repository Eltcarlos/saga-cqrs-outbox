import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentOutboxHelper } from './PaymentOutboxHelper';
import { OrderPaymentOutboxMessage } from '../../model/payment/OrderPaymentOutboxMessage';
import { OutboxStatus } from '@shared/domain/value-object/OutboxStatus';
import { SagaStatus } from '@shared/domain/value-object/SagaStatus';
import { PaymentRequestMessagePublisher } from '@order/application/ports/output/message/restaurantapproval/PaymentRequestMessagePublisher';

@Injectable()
export class PaymentOutboxScheduler {
  private readonly logger = new Logger(PaymentOutboxScheduler.name);

  constructor(
    private readonly paymentOutboxHelper: PaymentOutboxHelper,
    private readonly paymentRequestMessagePublisher: PaymentRequestMessagePublisher,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processOutboxMessages(): Promise<void> {
    const outboxMessages: OrderPaymentOutboxMessage[] =
      await this.paymentOutboxHelper.getPaymentOutboxMessageByOutboxStatusAndSagaStatus(
        OutboxStatus.STARTED,
        [SagaStatus.STARTED, SagaStatus.COMPENSATING],
      );

    if (outboxMessages.length > 0) {
      this.logger.log(
        `✅ Received ${outboxMessages.length} OrderPaymentOutboxMessage(s) with ids: ${outboxMessages
          .map((msg) => msg.getId())
          .join(', ')}, sending to message bus...`,
      );

      for (const outboxMessage of outboxMessages) {
        await this.paymentRequestMessagePublisher.publish(
          outboxMessage,
          this.updateOutboxStatus.bind(this),
        );
      }
    }
  }

  private async updateOutboxStatus(
    outboxMessage: OrderPaymentOutboxMessage,
    outboxStatus: OutboxStatus,
  ): Promise<void> {
    outboxMessage.setOutboxStatus(outboxStatus);
    await this.paymentOutboxHelper.save(outboxMessage);
    this.logger.log(
      `📝 Outbox message ${outboxMessage.getId()} updated to status: ${outboxStatus}`,
    );
  }
}
