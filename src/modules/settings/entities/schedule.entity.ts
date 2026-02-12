import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('sd_iot_schedule', { schema: 'public' })  
export class Schedule {
    // สำหรับ auto-increment
  @PrimaryGeneratedColumn('increment')
  schedule_id: number;

  @Column({ type: 'varchar', length: 255 })
  schedule_name: string;

  @Column({ type: 'int', nullable: true })
  device_id: number=1; 

  @Column({ type: 'varchar', length: 255 })
  start: string;

  @Column({ type: 'int', nullable: true })
  event: number=0;  // 1= on 0 =off

  @Column({ type: 'int', nullable: true })
  sunday: number=0; // 'วันอาทิตย์';

  @Column({ type: 'int', nullable: true })
  monday: number=0; // 'วันจันทร์';

  @Column({ type: 'int', nullable: true })
  tuesday: number=0; // 'วันอังคาร';

  @Column({ type: 'int', nullable: true })
  wednesday: number=0; //'วันพุธ';

  @Column({ type: 'int', nullable: true })
  thursday: number=0; //'วันพฤหัสบดี';

  @Column({ type: 'int', nullable: true })
  friday: number=0; // 'วันศุกร์';

  @Column({ type: 'int', nullable: true })
  saturday: number=0;  //'วันเสาร์';

  @ApiProperty({ description: 'created at' })
  @CreateDateColumn()
  createddate: Date;

  @ApiProperty({ description: 'updated at' })
  @UpdateDateColumn()
  updateddate: Date;

  @Column({ type: 'int', nullable: true })
  status: number=1;
} 




/*
* การแจ้งเตือน 
* * * * * * * * * * * * * * * * * * 
1. Warning เตือนภัยระดับกลาง   เช่น =>  35  องศาเชลเชียส
2. Alarm  เตือนภัยระดับร้ายแรง    เช่น =>37  องศาเชลเชียส
3. Warning recovery ยกเลิก=>เตือนภัยระดับกลาง   เช่น =>32  องศาเชลเชียส
4. Alarm recovery   ยกเลิก=>เตือนภัยระดับร้ายแรง  เช่น =>34  องศาเชลเชียส
* * * * * * * * * * * * * * * * * * 
* การแจ้งเตือน  แบบ Popup 
* การแจ้งเตือน แบบ สัญลักษณ์บอลลูน (Set up a balloon symbol alarm.) 
* การแจ้งเตือน บน Dashboard
* การแจ้งเตือน ส่งการแจ้งเตียน 
  1. Warning 
      =>ส่งการแจ้งเตียนภัย 
      1.1.1  Email -> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      1.1.2  Line  -> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      1.1.3  SMS   -> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      1.1.4 NO/NC   
        1.1.4.1.Siren speaker (ลำโพงไซเรน) 
        1.1.4.2.Siren Light (แสงสว่างไซเรน)
       
    1.2 สั่งงานอุปกรณ์ 
      --เลือกอุปกรณ์  เช่น พัดลม 1 พัดลม 2
      --เลือกการ สั่งงานอุปกรณ์ 
        -- เปิด อุปกรณ์ 
        -- ปิด อุปกรณ์ 

  * * * * * * * * * * * * * * * * * * 
  2. Alarm
     =>ส่งการแจ้งเตียนภัย
      2.1.เลือกทำงาน 
      2.1.1  Email ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      2.1.2  Line  ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      2.1.3  SMS   ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      2.1.4 NO/NC 
        2.1.4.1.Siren speaker (ลำโพงไซเรน) 
        2.1.4.2.Siren Light (แสงสว่างไซเรน)
        1.1.5 เลือคนที่จะส่ง การ แจ้งเตียนภัย
      2.1.5 เลือคนที่จะส่ง การ แจ้งเตียนภัย
    2.2 สั่งงานอุปกรณ์ 
      --เลือกอุปกรณ์  เช่น พัดลม 1 พัดลม 2
      --เลือกการ สั่งงานอุปกรณ์ 
        -- เปิด อุปกรณ์ 
        -- ปิด อุปกรณ์ 
  * * * * * * * * * * * * * * * * * * 
  3. Recovery Warning  ระบบกลับมาสู่ภาวะ ปกติ
    3.1.เลือกทำงาน 
      3.1.1  Email ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      3.1.2  Line  ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      3.1.3  SMS   ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
    3.2 เลือคนที่จะส่ง การ แจ้งเตียนภัย
    3.3 สั่งงานอุปกรณ์ 
      --เลือกอุปกรณ์  เช่น พัดลม 1 พัดลม 2
      --เลือกการ สั่งงานอุปกรณ์ 
        -- เปิด อุปกรณ์ 
        -- ปิด อุปกรณ์ 
  * * * * * * * * * * * * * * * * * * 
  4. Recovery Alarm   ระบบกลับมาสู่ภาวะ ปกติ
      4.1.เลือกทำงาน 
            4.1.1  Email  ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
            4.1.2  Line   ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
            4.1.3  SMS    ---> เลือคนที่จะส่ง การ แจ้งเตียนภัย
      4.2 เลือคนที่จะส่ง การ แจ้งเตียนภัย
      4.3 สั่งงานอุปกรณ์ 
      --เลือกอุปกรณ์  เช่น พัดลม 1 พัดลม 2
      --เลือกการ สั่งงานอุปกรณ์ 
        -- เปิด อุปกรณ์ 
        -- ปิด อุปกรณ์   

  - การบันทึกกระบวนการทำงาน แต่สถานะ  
  - ไม่ให้มีการส่ง ซ้ำ xxx ชั่วโมง
  - การบันทึก  สถานะ การส่ง ตรวจสอบว่าส่ง  
  - สร้าง Link กด รับทราบแล้ว  updat status action
  - ปิดการแจ้งเตียน รายบุคคล
  - ปิดการแจ้งเตียน ทั้งหมด
  * * * * * * * * * * * * * * * * * * 
  * * * * * * * * * * * * * * * * * * 
  * * * * * * * * * * * * * * * * * * 
  Schedule  ตั้งค่าทำงาน ตามตารางเวลา 
  1.ตั้งค่าชื่อการ ทำงาน
  2.ตั้งค่าทำงาน ตามตารางเวลา เช่น 8.00
  3.ที่เลือกให้ทำงาน
  4.เลือกการ สั่งงานอุปกรณ์ 
        -- เปิด อุปกรณ์ 
        -- ปิด อุปกรณ์     
  5.เลือกการ สั่งงานอุปกรณ์  ตามปฎิทิน สัปดาห์ 
    -จันทร์
    -อังคาร
    -พุธ
    -พถหัส
    -ศุกร์
    -เสาร์
    -อาทิตย์
  - การบันทึกกระบวนการทำงาน แต่สถานะ  
  * * * * * * * * * * * * * * * * * * 
  * * * * * * * * * * * * * * * * * * 
*/