"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationTables1699999999999 = void 0;
const typeorm_1 = require("typeorm");
class CreateNotificationTables1699999999999 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'notification_types',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'code',
                    type: 'varchar',
                    length: '50',
                    isUnique: true,
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'icon',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'color',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                },
                {
                    name: 'repeat_cooldown',
                    type: 'int',
                    default: 10,
                },
                {
                    name: 'should_notify',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'notification_configs',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'device_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'device_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'device_type',
                    type: 'enum',
                    enum: ['sensor', 'io'],
                },
                {
                    name: 'notification_type_id',
                    type: 'int',
                },
                {
                    name: 'cooldown_minutes',
                    type: 'int',
                    default: 10,
                },
                {
                    name: 'channels',
                    type: 'jsonb',
                },
                {
                    name: 'thresholds',
                    type: 'jsonb',
                },
                {
                    name: 'control_config',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'icon',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'color_normal',
                    type: 'varchar',
                    length: '20',
                    default: '#22C55E',
                },
                {
                    name: 'color_warning',
                    type: 'varchar',
                    length: '20',
                    default: '#F59E0B',
                },
                {
                    name: 'color_alarm',
                    type: 'varchar',
                    length: '20',
                    default: '#EF4444',
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'notification_logs',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'device_id',
                    type: 'int',
                },
                {
                    name: 'device_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'device_type',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'value_data',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'numeric_value',
                    type: 'float',
                    isNullable: true,
                },
                {
                    name: 'notification_type_id',
                    type: 'int',
                },
                {
                    name: 'status',
                    type: 'int',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'message',
                    type: 'text',
                },
                {
                    name: 'channels_sent',
                    type: 'jsonb',
                },
                {
                    name: 'control_action',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'redis_key',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'config_id',
                    type: 'int',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createIndex('notification_logs', new typeorm_1.TableIndex({
            name: 'IDX_NOTIFICATION_LOGS_DEVICE_ID',
            columnNames: ['device_id'],
        }));
        await queryRunner.createIndex('notification_logs', new typeorm_1.TableIndex({
            name: 'IDX_NOTIFICATION_LOGS_CREATED_AT',
            columnNames: ['created_at'],
        }));
        await queryRunner.createIndex('notification_logs', new typeorm_1.TableIndex({
            name: 'IDX_NOTIFICATION_LOGS_STATUS',
            columnNames: ['status'],
        }));
        await queryRunner.query(`
      ALTER TABLE notification_logs
      ADD CONSTRAINT FK_NOTIFICATION_LOGS_CONFIG
      FOREIGN KEY (config_id) REFERENCES notification_configs(id)
      ON DELETE SET NULL
    `);
        await queryRunner.query(`
      ALTER TABLE notification_configs
      ADD CONSTRAINT FK_NOTIFICATION_CONFIGS_TYPE
      FOREIGN KEY (notification_type_id) REFERENCES notification_types(id)
      ON DELETE RESTRICT
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE notification_logs
      DROP CONSTRAINT IF EXISTS FK_NOTIFICATION_LOGS_CONFIG
    `);
        await queryRunner.query(`
      ALTER TABLE notification_configs
      DROP CONSTRAINT IF EXISTS FK_NOTIFICATION_CONFIGS_TYPE
    `);
        await queryRunner.dropTable('notification_logs');
        await queryRunner.dropTable('notification_configs');
        await queryRunner.dropTable('notification_types');
    }
}
exports.CreateNotificationTables1699999999999 = CreateNotificationTables1699999999999;
//# sourceMappingURL=CreateNotificationTables.js.map