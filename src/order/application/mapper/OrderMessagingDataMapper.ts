import { plainToInstance } from 'class-transformer';
import { OutboxStatus } from '@shared/domain/value-object/OutboxStatus';
import { Logger } from '@nestjs/common';
import { SendResult } from '../ports/output/message/kafka/KafkaProducer';

export class OrderMessagingDataMapper {
  private readonly logger = new Logger(OrderMessagingDataMapper.name);

  getOrderEventPayload<T>(payload: string, outputType: new () => T): T {
    try {
      const json = JSON.parse(payload);
      return plainToInstance(outputType, json);
    } catch (error) {
      this.logger.error(`Could not read ${outputType.name} object!`, error);
      throw new Error(`Could not read ${outputType.name} object!`);
    }
  }

  getKafkaCallback<T, U>(
    responseTopicName: string,
    avroModel: T,
    outboxMessage: U,
    outboxCallback: (msg: U, status: OutboxStatus) => void,
    orderId: string,
    avroModelName: string
  ): (error: Error | null, result?: SendResult<string, T>) => void {
    return (error, result) => {
      if (error) {
        this.logger.error(
          `Error while sending ${avroModelName} with message: ${JSON.stringify(
            avroModel
          )} and outbox to topic ${responseTopicName}`,
          error
        );
        outboxCallback(outboxMessage, OutboxStatus.FAILED);
      } else if (result) {
        this.logger.log(
          `✅ Kafka response for order id: ${orderId} | Topic: ${result.topic} | Partition: ${result.partition} | Offset: ${result.offset} | Timestamp: ${result.timestamp}`
        );
        outboxCallback(outboxMessage, OutboxStatus.COMPLETED);
      }
    };
  }
}
