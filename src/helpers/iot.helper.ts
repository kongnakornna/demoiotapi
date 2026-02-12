export const enum PasswordCheckStrength {
  Short,
  Common,
  Weak,
  Ok,
  Strong,
}
const moment = require('moment');
const tz = require('moment-timezone');
const passwordConfig = Object.freeze({
  minLength: 8,
  atleaseOneLowercaseChar: true,
  atleaseOneUppercaseChar: true,
  atleaseOneDigit: true,
  atleaseOneSpecialChar: true,
});
var md5 = require('md5');
import 'dotenv/config';
var tzString = process.env.tzString;
require('dotenv').config();
var Url_api: any = process.env.API_URL;
export function nowdatetime() {
  var date: any = getCurrentDatenow();
  var timenow: any = getCurrentTimenow();
  var now = new Date();
  var pad = (num) => String(num).padStart(2, '0');
  var datePart = [
    now.getFullYear(),
    pad(now.getMonth() + 1), // getMonth() คืนค่า 0-11 เลยต้อง +1
    pad(now.getDate()),
  ].join('-');
  // จัดรูปแบบเวลา HH:MM:SS
  var timePart = [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join(':');
  // รวมวันที่และเวลาเข้าด้วยกัน
  var timestamp: any = datePart + ' ' + timePart;
  return timestamp;
}
export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
export function diffMinutesFromNow(timeString: any) {
  // แปลงสตริงเวลาที่รับมาเป็น Date object
  // ปรับรูปแบบเวลาให้รองรับ ISO 8601 ได้ง่าย เช่น เปลี่ยนช่องว่างกลางเป็น "T"
  const inputTime: any = new Date(timeString.replace(' ', 'T'));
  // เวลาปัจจุบัน
  const now: any = new Date();
  // หาค่าความต่างของเวลาระหว่าง now กับ timeString (หน่วยเป็นมิลลิวินาที)
  const diffMs = now - inputTime;
  // แปลงเป็นนาที (1 นาที = 60,000 มิลลิวินาที)
  const diffMins = diffMs / (1000 * 60);
  return diffMins;
  /*
      // ตัวอย่างใช้งาน
        const timeStr = "2025-07-04 14:54:28.066507";
        const minutesPassed = diffMinutesFromNow(timeStr);
        console.log(`ผ่านไปแล้ว ${minutesPassed.toFixed(2)} นาที`);
    */
}
export function getTodayName1(): string {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const todayIndex = new Date().getDay(); // 0=Sunday, 1=Monday...
  return days[todayIndex];
}
export function getCurrentDayname(): string {
  const today_name = getTodayName();
  return today_name;
}
export function getTodayName(): string {
  const today = new Date();
  const today_name = today
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  if (today_name === 'sunday') {
    return 'sunday';
  } else if (today_name === 'monday') {
    return 'monday';
  } else if (today_name === 'tuesday') {
    return 'tuesday';
  } else if (today_name === 'wednesday') {
    return 'wednesday';
  } else if (today_name === 'thursday') {
    return 'thursday';
  } else if (today_name === 'friday') {
    return 'friday';
  } else if (today_name === 'saturday') {
    return 'saturday';
  }
}
export function diffMinutes(
  currentTime: string | Date,
  logTime: string | Date,
): number {
  // แปลงเป็น Date object หากเป็น string
  const current =
    typeof currentTime === 'string' ? new Date(currentTime) : currentTime;
  const log = typeof logTime === 'string' ? new Date(logTime) : logTime;

  // หาค่าความต่างเวลาระหว่าง current และ log (หน่วยเป็น milliseconds)
  const diffMs = current.getTime() - log.getTime();

  // แปลงเป็นนาที (1 นาที = 60,000 milliseconds)
  const diffMins1 = diffMs / 60000;
  // ปัดเศษลงเป็นจำนวนเต็มนาที
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins;
}
export function getCurrentFullDatenow(): string {
  const now = new Date();
  const date = new Date(now);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  let numOfDay = date.getDate();
  let hour = date.getHours().toString().padStart(2, '0');
  let second = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minutes}:${second}`;
}
export function getCurrentDatenow(): string {
  const now = new Date();
  const date = new Date(now);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
export function getCurrentTimenow(): string {
  const now = new Date();
  const date = new Date(now);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
export function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  // เติม 0 หน้าหากชั่วโมงหรือ นาที น้อยกว่า 10
  const hh = hours < 10 ? '0' + hours : hours.toString();
  const mm = minutes < 10 ? '0' + minutes : minutes.toString();
  return `${hh}:${mm}`;
  console.log(getCurrentTime()); // เช่น "12:00"
}
export function getCurrentTimeStatus(
  scheduleTime: string,
  schedule_event_start: string,
) {
  const toMinutes = (t: string): number => {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  };
  var consVae: number = 30; // กำหนดช่วงกี่นาที
  var MINUTES_IN_DAY = 1440;
  var now = new Date();
  var nowMin = now.getHours() * 60 + now.getMinutes(); // เวลาปัจจุบันเป็นนาที
  var scheduleMin = toMinutes(scheduleTime); // เวลาเป้าหมายเป็นนาที
  var schedule_event_start_set1 = toMinutes(scheduleTime);
  var schedule_event_start_set2 = toMinutes(schedule_event_start);
  if (schedule_event_start_set1 == schedule_event_start_set2) {
    var windowStart: any = schedule_event_start_set2;
  } else {
    var windowStart: any = nowMin;
  }
  const windowEnd = (nowMin + consVae) % MINUTES_IN_DAY;
  var cons1: any = 1;
  var cons2: any = 0;
  var cons11: any =
    `1- ${scheduleMin} - In the period ` +
    windowStart +
    `:00 ± ` +
    consVae +
    ` minute`;
  var cons22: any =
    `2- ${scheduleMin} - Out of range ` +
    windowStart +
    `:00 ± ` +
    consVae +
    ` minute`;
  var count_time: any = schedule_event_start_set1 - schedule_event_start_set2;
  if (scheduleMin >= windowStart) {
    var rt = 'scheduleMin>=windowStart';
  } else if (scheduleMin <= windowEnd) {
    var rt = 'scheduleMin>=windowEnd';
  }
  if (windowEnd >= windowStart) {
    if (count_time >= 0) {
      if ((count_time == 0 || count_time <= consVae) && count_time >= 0) {
        var status: any = 1;
      } else {
        var status: any = 0;
      }
    } else {
      var status: any = 0;
    }
  } else {
    var status: any = 0;
  }
  return status;
}
export function getCurrentTimeStatusMsg(
  scheduleTime: string,
  schedule_event_start: string,
) {
  const toMinutes = (t: string): number => {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  };
  var consVae: number = 30; // กำหนดช่วงกี่นาที
  var MINUTES_IN_DAY = 1440;
  var now = new Date();
  var nowMin = now.getHours() * 60 + now.getMinutes(); // เวลาปัจจุบันเป็นนาที
  var scheduleMin = toMinutes(scheduleTime); // เวลาเป้าหมายเป็นนาที
  var schedule_event_start_set1 = toMinutes(scheduleTime);
  var schedule_event_start_set2 = toMinutes(schedule_event_start);
  if (schedule_event_start_set1 == schedule_event_start_set2) {
    var windowStart: any = schedule_event_start_set2;
  } else {
    var windowStart: any = nowMin;
  }
  const windowEnd = (nowMin + consVae) % MINUTES_IN_DAY;
  var cons1: any = 1;
  var cons2: any = 0;
  var cons11: any =
    `1- ${scheduleMin} - In the period ` +
    windowStart +
    `:00 ± ` +
    consVae +
    ` minute`;
  var cons22: any =
    `2- ${scheduleMin} - Out of range ` +
    windowStart +
    `:00 ± ` +
    consVae +
    ` minute`;
  var count_time: any = schedule_event_start_set1 - schedule_event_start_set2;
  if (scheduleMin >= windowStart) {
    var rt = 'scheduleMin>=windowStart';
  } else if (scheduleMin <= windowEnd) {
    var rt = 'scheduleMin>=windowEnd';
  }
  if (windowEnd >= windowStart) {
    if (count_time >= 0) {
      if ((count_time == 0 || count_time <= consVae) && count_time >= 0) {
        var status: any = 1;
      } else {
        var status: any = 0;
      }
    } else {
      var status: any = 0;
    }
  } else {
    var status: any = 0;
  }
  var dataset1: any = {
    TimeStart: windowStart,
    nowMin: nowMin,
    TimeEnd: windowEnd,
    scheduleTime: scheduleTime,
    balance: scheduleTime + ' = ' + schedule_event_start,
    balance1: windowEnd + ' = ' + windowStart,
    balance2: schedule_event_start_set1 + ' = ' + schedule_event_start_set2,
    count_time: count_time,
    status: status,
    now: now,
    consVae: consVae,
    cons1: cons1,
    cons11: cons11,
    scheduleMin: scheduleMin,
    schedule_event_start: schedule_event_start,
    schedule_event_start_set1: schedule_event_start_set1,
    schedule_event_start_set2: schedule_event_start_set2,
  };
  return dataset1;
  /*
  var dataset2:any={  
                    balance:scheduleTime+' = '+schedule_event_start,
                    balance2:schedule_event_start_set1+' = '+schedule_event_start_set2,
                    count_time:count_time,
                    status:status,
                    now:now,
                    consVae:consVae,
                    cons2:cons2,
                    cons22:cons22,
                    nowMin:nowMin, 
                    windowEnd:windowEnd,
                    scheduleMin:scheduleMin,
                    schedule_event_start:schedule_event_start,
                    scheduleTime:scheduleTime,
                    windowStart:windowStart,
                    schedule_event_start_set1:schedule_event_start_set1,
                    schedule_event_start_set2:schedule_event_start_set2,
                    };
  */
  // ปกติ (เวลาไม่ข้ามวัน)
  /*
  if (windowStart <= windowEnd) {
    //return (scheduleMin >= windowStart && scheduleMin <= windowEnd) ? '1' : '0';
    if (scheduleMin >= windowStart ) {
      console.log('cons1=>'+cons1); 
      return dataset1;
    }else if (scheduleMin <= windowEnd) {
      console.log('cons2=>'+cons2); 
       return dataset2;
    } 
  } else {
    // ช่วงข้ามวัน เช่น 23:50 ถึง 00:20
    //return (scheduleMin >= windowStart || scheduleMin <= windowEnd) ? '1' : '0';
    if (scheduleMin >= windowStart ) {
      console.log('cons1=>'+cons1); 
      return dataset1;
    }else if (scheduleMin <= windowEnd) {
      console.log('cons2=>'+cons2); 
       return dataset2;
    } 
  }
  */
  /*
    ตัวอย่าง
      สมมติ ตอนนี้เวลา 16:00 (nowMin = 960)
      scheduleTime = '16:10' → '1'
      scheduleTime = '16:31' → '0'
      scheduleTime = '15:59' → '0'
      สมมติ ตอนนี้เวลา 23:50 (nowMin = 1430, windowEnd = 20)
      scheduleTime = '23:55' → '1'
      scheduleTime = '00:10' → '1'
      scheduleTime = '00:21' → '0'

      สรุป:
      ไม่ต้องแยก if (scheduleMin >= windowStart) หรือ (scheduleMin <= windowEnd) เดี่ยว ๆ
      ให้ใช้เงื่อนไขแบบ "&&" และ "||" ตามตัวอย่างด้านบนเท่านั้น
      โค้ดนี้ใช้ได้ทุกกรณี ครอบคลุมทั้งปกติและข้ามวัน
      Return '1' ถ้าอยู่ในช่วงเวลา, '0' ถ้าไม่อยู่ในช่วง
      🟢 คัดลอกโค้ดนี้ไปใช้ได้เลย ถูกต้องแน่นอน!
      หากต้องการขยาย logic หรือข้อความเพิ่มเติม แจ้งได้ครับ!
  */
}
export function timeConverter(UNIX_timestamp: any) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}
export function toThaiDate(date: any) {
  let monthNames = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  let year = date.getFullYear() + 543;
  let month = monthNames[date.getMonth()];
  let numOfDay = date.getDate();
  let hour = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let second = date.getSeconds().toString().padStart(2, '0');
  return `${numOfDay} ${month} ${year} ` + `${hour}:${minutes}:${second} น.`;
}
export function toEnDate(date: any) {
  let monthNames = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May.',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
  ];
  let monthNameslong = [
    'January',
    'February',
    'March.',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let year = date.getFullYear() + 0;
  let month = monthNameslong[date.getMonth()];
  let numOfDay = date.getDate();
  let hour = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let second = date.getSeconds().toString().padStart(2, '0');
  return `${numOfDay} ${month} ${year} ` + `${hour}:${minutes}:${second}`;
}
export function getRandomint(length: any) {
  var randomChars: any = '0123456789';
  var result: any = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );
  }
  return result;
}
// hardware_id | type_id = 1  Sensor  sensorValue
// hardware_id | type_id = 2  IO Sensor  0=Warning 1=Normal
// hardware_id | type_id = 3  IO Control 1=ON 0=OFF
// hardware_id | type_id = 4  Critical Sensor  IO Sensor  0=Critical 1=Normal
/*
            hardware_id | type_id = 1  Sensor  sensorValue 
            hardware_id | type_id = 2  IO Sensor  0=Warning 1=Normal
            hardware_id | type_id = 3  IO Control 1=ON 0=OFF 
            hardware_id | type_id = 4  Critical Sensor  IO Sensor  0=Critical 1=Normal
            * function getStatusText($alarm_status) {
              switch($alarm_status) {
                  case 1: return 'Warning';
                  case 2: return 'Critical';
                  case 3: return 'Recovery Warning';
                  case 4: return 'Recovery Critical';
                  case 5: return 'Normal';
                  case 999: return 'Normal';
                  default: return 'Unknown';
              }
            }
*/
export function AlarmDetailValidate(dto: any) {
  try {
    var case1: any = 'Warning';
    var case2: any = 'Critical';
    var case3: any = 'Recovery Warning';
    var case4: any = 'Recovery Critical';
    var case5: any = 'Normal';
    var case6: any = 'Normal';
    var case7: any = 'Unknown';
    var case7: any = 'Critical Highest! Maximum limit.';
    var case8: any = 'Critical Highest! Minimum limit';
    console.log('getAlarmDetails dto-->', dto);
    var timestamp: any = nowdatetime();
    const unit: string = dto.unit || '';
    let type_id: number = dto.type_id ? parseFloat(dto.type_id) : 0;
    // ใช้ alarmTypeId ถ้ามี ถ้าไม่มีใช้ type_id
    if (dto.alarmTypeId) {
      type_id = parseFloat(dto.hardware_id);
    }

    let sensorValues: any = dto.value_data;
    if (
      sensorValues !== null &&
      sensorValues !== undefined &&
      sensorValues !== ''
    ) {
      const sensorValueNum = parseFloat(sensorValues);
      if (!isNaN(sensorValueNum)) {
        sensorValues = sensorValueNum;
      }
    }
    var max: any = dto.max ?? '';
    var min: any = dto.min ?? '';
    const statusAlert: number = parseFloat(dto.status_alert) || 0;
    const statusWarning: number = parseFloat(dto.status_warning) || 0;
    const recoveryWarning: number = parseFloat(dto.recovery_warning) || 0;
    const recoveryAlert: number = parseFloat(dto.recovery_alert) || 0;
    const mqttName: string = ''; // dto.mqtt_name ถูกตั้งเป็น string ว่าง
    const deviceName: string = dto.device_name || '';
    const alarmActionName: string = dto.action_name || '';
    const mqttControlOn: string = dto.mqtt_control_on || '';
    const mqttControlOff: string = dto.mqtt_control_off || '';
    const count_alarm: number = parseFloat(dto.count_alarm) || 0;
    const event: number = parseFloat(dto.event) || 0;
    let dataAlarm: number = 999;
    let eventControl: number = event;
    let messageMqttControl: string =
      event === 1 ? mqttControlOn : mqttControlOff;
    let alarmStatusSet: number = 999;
    let subject: string = '';
    let content: string = '';
    let status: number = 5;
    let data_alarm: number = 0;
    let value_data: any = dto.value_data;
    let value_alarm: any = dto.value_alarm || '';
    let value_relay: any = dto.value_relay || '';
    let value_control_relay: any = dto.value_control_relay || '';
    let sensor_data: any = null;
    let title: any = case5;
    sensor_data = parseFloat(dto.value_data) || 0;
    const sensorValue = sensor_data; // ใช้ sensor_data เป็น sensorValue
    if (
      (sensorValue == 1 ||
        sensorValue == 0 ||
        sensorValue == 'ON' ||
        sensorValue == 'OFF' ||
        sensorValue == 'on' ||
        sensorValue == 'off') &&
      type_id == 3
    ) {
      alarmStatusSet = 999;
      title = case5;
      subject = case5;
      content = case5;
      dataAlarm = 0;
      data_alarm = 0;
      status = 5;
    } else if (sensorValue != 1 && type_id == 4) {
      // Critical Sensor  IO Sensor  0=Critical 1=Normal
      alarmStatusSet = 2;
      title = case2;
      subject = `${mqttName} ${case2} ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 2;
    } else if (sensorValue == 1 && type_id == 4) {
      alarmStatusSet = 999;
      title = case5;
      subject = case5;
      content = case5;
      dataAlarm = 0;
      data_alarm = 0;
      status = 5;
    } else if (
      max != '' &&
      sensorValue >= max &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 2;
      title = case7;
      subject = `${mqttName} ${case7}: ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case7}: ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 2;
    } else if (
      min != '' &&
      sensorValue <= min &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 1;
      title = case8;
      subject = `${mqttName} ${case8}: ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case8} : ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 1;
    } else if (
      (sensorValue > statusWarning || sensorValue === statusWarning) &&
      statusWarning < statusAlert &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 1;
      title = case1;
      subject = `${mqttName} ${case1} : ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case1}: ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 1;
    } else if (
      (sensorValue > statusAlert || sensorValue === statusAlert) &&
      statusAlert > statusWarning &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 2;
      title = case2;
      subject = `${mqttName} ${case2} : ${deviceName} :${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
      dataAlarm = statusAlert;
      data_alarm = statusAlert;
      status = 2;
    } else if (
      count_alarm >= 1 &&
      (sensorValue < recoveryWarning || sensorValue === recoveryWarning) &&
      recoveryWarning <= recoveryAlert &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 3;
      title = case3;
      subject = `${mqttName} ${case3} : ${deviceName} :${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case3}: ${deviceName} :${sensorValue}`;
      dataAlarm = recoveryWarning;
      data_alarm = recoveryWarning;
      eventControl = event === 1 ? 0 : 1;
      messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
      status = 3;
    } else if (
      count_alarm >= 1 &&
      (sensorValue < recoveryAlert || sensorValue === recoveryAlert) &&
      recoveryAlert >= recoveryWarning &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 4;
      title = `${mqttName} ${case4}`;
      subject = `${mqttName} ${case4} :${deviceName} :${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case4} : ${deviceName} :${sensorValue}`;
      dataAlarm = recoveryAlert;
      data_alarm = recoveryAlert;
      eventControl = event === 1 ? 0 : 1;
      messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
      status = 4;
    } else {
      alarmStatusSet = 999;
      title = case5;
      subject = case5;
      content = case5;
      dataAlarm = 0;
      data_alarm = 0;
      status = 5;
    }
    // 6. สร้าง object ผลลัพธ์
    const result = {
      status: status,
      statusControl: status,
      alarmTypeId: type_id,
      type_id: type_id,
      alarmStatusSet: alarmStatusSet,
      title,
      subject: subject,
      content: content,
      value_data: value_data,
      value_alarm: dto.value_alarm || '',
      value_relay: value_relay,
      value_control_relay: value_control_relay,
      dataAlarm: dataAlarm,
      data_alarm: data_alarm,
      max: max,
      min: min,
      eventControl: eventControl,
      messageMqttControl: messageMqttControl,
      sensor_data: sensor_data,
      count_alarm: count_alarm,
      mqttName: mqttName,
      mqtt_name: dto.mqtt_name || '',
      device_name: dto.device_name || '',
      mqtt_control_on: dto.mqtt_control_on || '',
      unit: dto.unit || '',
      sensorValue: dto.sensorValueData || '',
      statusAlert: statusAlert,
      statusWarning: statusWarning,
      recoveryWarning: recoveryWarning,
      recoveryAlert: dto.recovery_alert || '',
      deviceName: dto.device_name || '',
      alarmActionName: dto.action_name || '',
      mqttControlOn: dto.mqtt_control_on || '',
      mqttControlOff: dto.mqtt_control_off || '',
      event: dto.event || 0,
      timestamp,
      //dto: dto,
    };
    return result;
  } catch (error) {
    console.error('Error in getAlarmDetails:', error);
    throw error;
  }
}
export function AlarmDetailValidateTh(dto: any) {
  var case1: any = 'คำเตือนมีความผิดปกติ';
  var case2: any = 'ภาวะวิกฤตต้องแก้ไขทันที';
  var case3: any = 'คืนสู่ภาวะปกติ';
  var case4: any = 'คืนสู่ภาวะปกติ';
  var case5: any = 'ปกติ';
  var case6: any = 'ปกติ';
  var case7: any = 'ไม่ทราบสาเหตุ';
  var case7: any = 'วิกฤตมีค่าสูงเกินกำหนด';
  var case8: any = 'วิกฤตมีค่าต่ำกว่ากำหนด';
  try {
    console.log('getAlarmDetails dto-->', dto);
    var timestamp: any = nowdatetime();
    const unit: string = dto.unit || '';
    let type_id: number = dto.type_id ? parseFloat(dto.type_id) : 0;
    // ใช้ alarmTypeId ถ้ามี ถ้าไม่มีใช้ type_id
    if (dto.alarmTypeId) {
      type_id = parseFloat(dto.hardware_id);
    }

    let sensorValues: any = dto.value_data;
    if (
      sensorValues !== null &&
      sensorValues !== undefined &&
      sensorValues !== ''
    ) {
      const sensorValueNum = parseFloat(sensorValues);
      if (!isNaN(sensorValueNum)) {
        sensorValues = sensorValueNum;
      }
    }
    var max: any = dto.max ?? '';
    var min: any = dto.min ?? '';
    const statusAlert: number = parseFloat(dto.status_alert) || 0;
    const statusWarning: number = parseFloat(dto.status_warning) || 0;
    const recoveryWarning: number = parseFloat(dto.recovery_warning) || 0;
    const recoveryAlert: number = parseFloat(dto.recovery_alert) || 0;
    const mqttName: string = ''; // dto.mqtt_name ถูกตั้งเป็น string ว่าง
    const deviceName: string = dto.device_name || '';
    const alarmActionName: string = dto.action_name || '';
    const mqttControlOn: string = dto.mqtt_control_on || '';
    const mqttControlOff: string = dto.mqtt_control_off || '';
    const count_alarm: number = parseFloat(dto.count_alarm) || 0;
    const event: number = parseFloat(dto.event) || 0;
    let dataAlarm: number = 999;
    let eventControl: number = event;
    let messageMqttControl: string =
      event === 1 ? mqttControlOn : mqttControlOff;
    let alarmStatusSet: number = 999;
    let subject: string = '';
    let content: string = '';
    let status: number = 5;
    let data_alarm: number = 0;
    let value_data: any = dto.value_data;
    let value_alarm: any = dto.value_alarm || '';
    let value_relay: any = dto.value_relay || '';
    let value_control_relay: any = dto.value_control_relay || '';
    let sensor_data: any = null;
    let title: any = case5;
    sensor_data = parseFloat(dto.value_data) || 0;
    const sensorValue = sensor_data; // ใช้ sensor_data เป็น sensorValue
    if (
      (sensorValue == 1 ||
        sensorValue == 0 ||
        sensorValue == 'ON' ||
        sensorValue == 'OFF' ||
        sensorValue == 'on' ||
        sensorValue == 'off') &&
      type_id == 3
    ) {
      alarmStatusSet = 999;
      title = case5;
      subject = case5;
      content = case5;
      dataAlarm = 0;
      data_alarm = 0;
      status = 5;
    } else if (sensorValue != 1 && type_id == 4) {
      // Critical Sensor  IO Sensor  0=Critical 1=Normal
      alarmStatusSet = 2;
      title = case2;
      subject = `${mqttName} ${case2} ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 2;
    } else if (sensorValue == 1 && type_id == 4) {
      alarmStatusSet = 999;
      title = case5;
      subject = case5;
      content = case5;
      dataAlarm = 0;
      data_alarm = 0;
      status = 5;
    } else if (
      max != '' &&
      sensorValue >= max &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 2;
      title = case7;
      subject = `${mqttName} ${case7}: ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case7}: ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 2;
    } else if (
      min != '' &&
      sensorValue <= min &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 1;
      title = case8;
      subject = `${mqttName} ${case8}: ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case8} : ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 1;
    } else if (
      (sensorValue > statusWarning || sensorValue === statusWarning) &&
      statusWarning < statusAlert &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 1;
      title = case1;
      subject = `${mqttName} ${case1} : ${deviceName} : ${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case1}: ${deviceName} :${sensorValue}`;
      dataAlarm = statusWarning;
      data_alarm = statusWarning;
      status = 1;
    } else if (
      (sensorValue > statusAlert || sensorValue === statusAlert) &&
      statusAlert > statusWarning &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 2;
      title = case2;
      subject = `${mqttName} ${case2} : ${deviceName} :${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
      dataAlarm = statusAlert;
      data_alarm = statusAlert;
      status = 2;
    } else if (
      count_alarm >= 1 &&
      (sensorValue < recoveryWarning || sensorValue === recoveryWarning) &&
      recoveryWarning <= recoveryAlert &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 3;
      title = case3;
      subject = `${mqttName} ${case3} : ${deviceName} :${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case3}: ${deviceName} :${sensorValue}`;
      dataAlarm = recoveryWarning;
      data_alarm = recoveryWarning;
      eventControl = event === 1 ? 0 : 1;
      messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
      status = 3;
    } else if (
      count_alarm >= 1 &&
      (sensorValue < recoveryAlert || sensorValue === recoveryAlert) &&
      recoveryAlert >= recoveryWarning &&
      (type_id == 1 || type_id == 2)
    ) {
      alarmStatusSet = 4;
      title = `${mqttName} ${case4}`;
      subject = `${mqttName} ${case4} :${deviceName} :${sensorValue} ${unit}`;
      content = `${mqttName} ${alarmActionName} ${case4} : ${deviceName} :${sensorValue}`;
      dataAlarm = recoveryAlert;
      data_alarm = recoveryAlert;
      eventControl = event === 1 ? 0 : 1;
      messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
      status = 4;
    } else {
      alarmStatusSet = 999;
      title = case5;
      subject = case5;
      content = case5;
      dataAlarm = 0;
      data_alarm = 0;
      status = 5;
    }
    // 6. สร้าง object ผลลัพธ์
    const result = {
      status: status,
      statusControl: status,
      alarmTypeId: type_id,
      type_id: type_id,
      alarmStatusSet: alarmStatusSet,
      title,
      subject: subject,
      content: content,
      value_data: value_data,
      value_alarm: dto.value_alarm || '',
      value_relay: value_relay,
      value_control_relay: value_control_relay,
      dataAlarm: dataAlarm,
      data_alarm: data_alarm,
      max: max,
      min: min,
      eventControl: eventControl,
      messageMqttControl: messageMqttControl,
      sensor_data: sensor_data,
      count_alarm: count_alarm,
      mqttName: mqttName,
      mqtt_name: dto.mqtt_name || '',
      device_name: dto.device_name || '',
      mqtt_control_on: dto.mqtt_control_on || '',
      unit: dto.unit || '',
      sensorValue: dto.sensorValueData || '',
      statusAlert: statusAlert,
      statusWarning: statusWarning,
      recoveryWarning: recoveryWarning,
      recoveryAlert: dto.recovery_alert || '',
      deviceName: dto.device_name || '',
      alarmActionName: dto.action_name || '',
      mqttControlOn: dto.mqtt_control_on || '',
      mqttControlOff: dto.mqtt_control_off || '',
      event: dto.event || 0,
      timestamp,
      //dto: dto,
    };
    return result;
  } catch (error) {
    console.error('Error in getAlarmDetails:', error);
    throw error;
  }
}
export function getStatusCriticalEn(alarm_status: any): number {
  var case1: any = 'Normal';
  var case2: any = 'Critical';
  var case7: any = 'Unknown';
  switch (alarm_status) {
    case 1:
      return case1;
    case 0:
      return case2;
    default:
      return case7;
  }
}
export function getStatusCriticalTh(alarm_status: any): number {
  var case1: any = 'ภาวะวิกฤตต้องแก้ไขทันที';
  var case2: any = 'ปกติ';
  var case7: any = 'ไม่ทราบสถานะ';
  switch (alarm_status) {
    case 1:
      return case1;
    case 0:
      return case2;
    default:
      return case7;
  }
}
export function getStatusWarningEn(alarm_status: any): number {
  var case1: any = 'Normal';
  var case2: any = 'Warning';
  var case7: any = 'Unknown';
  switch (alarm_status) {
    case 1:
      return case1;
    case 0:
      return case2;
    default:
      return case7;
  }
}
export function getStatusWarningTh(alarm_status: any): number {
  var case1: any = 'ปกติ';
  var case2: any = 'คำเตือนเกิดภาวะผิดปกติ';
  var case7: any = 'ไม่ทราบสถานะ';
  switch (alarm_status) {
    case 1:
      return case1;
    case 0:
      return case2;
    default:
      return case7;
  }
}
export function getStatusIoEn(alarm_status: any): number {
  var case1: any = 'ON';
  var case2: any = 'OFF';
  var case7: any = 'Unknown';
  switch (alarm_status) {
    case 1:
      return case1;
    case 2:
      return case2;
    default:
      return case7;
  }
}
export function getStatusIoTh(alarm_status: any): number {
  var case1: any = 'เปิด';
  var case2: any = 'ปิด';
  var case7: any = 'ไม่ทราบสถานะ';
  switch (alarm_status) {
    case 1:
      return case1;
    case 2:
      return case2;
    default:
      return case7;
  }
}
export function getStatusTextEn(alarm_status: any): number {
  var case1: any = 'Warning';
  var case2: any = 'Critical';
  var case3: any = 'Recovery Warning';
  var case4: any = 'Recovery Critical';
  var case5: any = 'Normal';
  var case6: any = 'Normal';
  var case7: any = 'Unknown';
  switch (alarm_status) {
    case 1:
      return case1;
    case 2:
      return case2;
    case 3:
      return case3;
    case 4:
      return case4;
    case 5:
      return case5;
    case 999:
      return case6;
    default:
      return case7;
  }
}
export function getStatusTextTh(alarm_status: any): number {
  var case1: any = 'คำเตือนมีความผิดปกติ';
  var case2: any = 'ภาวะวิกฤตต้องแก้ไขทันที';
  var case3: any = 'คืนสู่ภาวะปกติ';
  var case4: any = 'คืนสู่ภาวะปกติ';
  var case5: any = 'ปกติ';
  var case6: any = 'ปกติ';
  var case7: any = 'ไม่ทราบสาเหตุ';
  switch (alarm_status) {
    case 1:
      return case1;
    case 2:
      return case2;
    case 3:
      return case3;
    case 4:
      return case4;
    case 5:
      return case5;
    case 999:
      return case6;
    default:
      return case7;
  }
}
export function getStatusInt(alarm_status: any): number {
  var case1: number = 1;
  var case2: number = 2;
  var case3: number = 3;
  var case4: number = 4;
  var case5: number = 5;
  var case6: number = 999;
  switch (alarm_status) {
    case 1:
      return case1;
    case 2:
      return case2;
    case 3:
      return case3;
    case 4:
      return case4;
    case 5:
      return case5;
    case 999:
      return case6;
    default:
      return 0;
  }
}
