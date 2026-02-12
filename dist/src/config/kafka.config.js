"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConfig = void 0;
const microservices_1 = require("@nestjs/microservices");
exports.kafkaConfig = {
    transport: microservices_1.Transport.KAFKA,
    options: {
        client: {
            clientId: 'nestjs-kafka-client',
            brokers: ['localhost:9092'],
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
//# sourceMappingURL=kafka.config.js.map