export abstract class KafkaProducer<K, V> {
  abstract send(
    topicName: string,
    key: K,
    message: V,
    callback: (error: Error | null, result?: SendResult<K, V>) => void
  ): void;
}

export interface SendResult<K, V> {
  topic: string;
  partition: number;
  offset: string;
  timestamp: string;
  key: K;
  value: V;
}
