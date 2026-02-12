// kafka/kafka.config.ts
import { KafkaOptions, Transport } from '@nestjs/microservices';
export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'nestjs-kafka-client',
      brokers: ['localhost:9092'], // Kafka brokers
      // SSL configuration (ถ้ามี)
      // ssl: true,
      // sasl: {
      //   mechanism: 'plain',
      //   username: 'username',
      //   password: 'password',
      // },
    },
    consumer: {
      groupId: 'nestjs-consumer-group',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};