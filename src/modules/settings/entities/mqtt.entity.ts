import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sd_iot_mqtt', { schema: 'public' })
export class Mqtt {
  @PrimaryGeneratedColumn('increment')
  mqtt_id: number;

  @Column({ nullable: true })
  mqtt_type_id: number;

  @Column({ default: 1 })
  sort: number;

  @Column({ nullable: true })
  mqtt_name: string;

  @Column({ nullable: true })
  host: string;

  @Column({ nullable: true })
  port: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  secret: string;

  @Column({ nullable: true })
  expire_in: string;

  @Column({ nullable: true })
  token_value: string;

  @Column({ nullable: true })
  org: string;

  @Column({ nullable: true })
  bucket: string;

  @Column({ nullable: true })
  envavorment: string;

  @CreateDateColumn()
  createddate: Date;

  @UpdateDateColumn()
  updateddate: Date;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'int', default: 1, nullable: true })
  location_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  latitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  longitude: string;

  @ApiProperty({ description: 'MQTT Main ID', default: 1 })
  @Column({ type: 'int', default: 1 })
  mqtt_main_id: number;

  @Column({
    name: 'configuration',
    type: 'text',
    nullable: true,
    default: {
      '0': 'temperature1',
      '1': 'humidity1',
      '2': 'temperature2',
      '3': 'humidity2',
      '4': 'temperature3',
      '5': 'input1',
      '6': 'AIR1',
      '7': 'AIR2',
      '8': 'UPS1',
      '9': 'UPS2',
      '10': 'Fire',
      '11': 'waterleak',
      '12': 'HSSD',
      '13': 'Temp',
      '14': 'Volt',
      '15': 'Amp',
    },
  })
  configuration: string;
}

/*

// configuration
        // ตรวจสอบ sn ซ้ำ
        // SELECT * FROM sd_iot_mqtt WHERE mqtt_name='AIRCOM1 ระบบแอร์' 
        // SELECT * FROM sd_iot_mqtt WHERE bucket='AIRCOM1' 
        วิธีแก้ไข Primary Key ซ้ำ
        เช็กชื่อ sequence ใน database:
        ใช้คำสั่ง SQL เพื่อค้นหาชื่อ sequence ที่เชื่อมกับ mqtt_id:
        text
        SELECT pg_get_serial_sequence('sd_iot_mqtt', 'mqtt_id');
        ผลลัพธ์เช่น 'sd_iot_mqtt_mqtt_id_seq'.
        ปรับ sequence ให้ตรงกับค่ามากสุดใน table:
        รันคำสั่ง SQL เพื่อตั้ง sequence ให้มีค่าเท่ากับสูงสุดใน mqtt_id ปัจจุบัน (แล้วบวก 1)
        text
        SELECT setval('sd_iot_mqtt_mqtt_id_seq', (SELECT MAX(mqtt_id) FROM sd_iot_mqtt));
        หรือแนะนำให้ใช้
        text
        SELECT setval('sd_iot_mqtt_mqtt_id_seq', COALESCE(MAX(mqtt_id),1), true) FROM sd_iot_mqtt;
        เมื่อ sequence “sync” แล้ว การ insert ใหม่จะไม่ชนกับค่าเดิมอีก.
        ไม่ควรใส่ค่าคอลัมน์ mqtt_id เองถ้าใช้ PrimaryGeneratedColumn เพราะระบบจะสร้างให้อัตโนมัติ.
        หมายเหตุ
        หากมีการ import หรือ INSERT ข้อมูลด้วย mqtt_id ที่ระบุเอง ต้อง reset sequence ทุกครั้งหลังเสร็จ เพื่อไม่ให้เกิด duplicate key violation.
        การใช้ @PrimaryGeneratedColumn('increment') จะให้ TypeORM/DB กำหนดเลขใหม่อัตโนมัติ ถ้าทำตามขั้นตอนข้างบนจะไม่ชนค่าเดิมอีก.
        สรุป
        ต้อง reset sequence ของ primary key ให้ตรงกับค่ามากสุดใน table เพื่อให้การ generate id ครั้งถัดไปไม่ซ้ำกับข้อมูลที่มีอยู่แล้ว.
*/
