"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusInt = exports.getStatusTextTh = exports.getStatusTextEn = exports.getStatusIoTh = exports.getStatusIoEn = exports.getStatusWarningTh = exports.getStatusWarningEn = exports.getStatusCriticalTh = exports.getStatusCriticalEn = exports.AlarmDetailValidateTh = exports.AlarmDetailValidate = exports.getRandomint = exports.toEnDate = exports.toThaiDate = exports.timeConverter = exports.getCurrentTimeStatusMsg = exports.getCurrentTimeStatus = exports.getCurrentTime = exports.getCurrentTimenow = exports.getCurrentDatenow = exports.getCurrentFullDatenow = exports.diffMinutes = exports.getTodayName = exports.getCurrentDayname = exports.getTodayName1 = exports.diffMinutesFromNow = exports.timeToMinutes = exports.nowdatetime = void 0;
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
require("dotenv/config");
var tzString = process.env.tzString;
require('dotenv').config();
var Url_api = process.env.API_URL;
function nowdatetime() {
    var date = getCurrentDatenow();
    var timenow = getCurrentTimenow();
    var now = new Date();
    var pad = (num) => String(num).padStart(2, '0');
    var datePart = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
    ].join('-');
    var timePart = [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
    ].join(':');
    var timestamp = datePart + ' ' + timePart;
    return timestamp;
}
exports.nowdatetime = nowdatetime;
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}
exports.timeToMinutes = timeToMinutes;
function diffMinutesFromNow(timeString) {
    const inputTime = new Date(timeString.replace(' ', 'T'));
    const now = new Date();
    const diffMs = now - inputTime;
    const diffMins = diffMs / (1000 * 60);
    return diffMins;
}
exports.diffMinutesFromNow = diffMinutesFromNow;
function getTodayName1() {
    const days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    const todayIndex = new Date().getDay();
    return days[todayIndex];
}
exports.getTodayName1 = getTodayName1;
function getCurrentDayname() {
    const today_name = getTodayName();
    return today_name;
}
exports.getCurrentDayname = getCurrentDayname;
function getTodayName() {
    const today = new Date();
    const today_name = today
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
    if (today_name === 'sunday') {
        return 'sunday';
    }
    else if (today_name === 'monday') {
        return 'monday';
    }
    else if (today_name === 'tuesday') {
        return 'tuesday';
    }
    else if (today_name === 'wednesday') {
        return 'wednesday';
    }
    else if (today_name === 'thursday') {
        return 'thursday';
    }
    else if (today_name === 'friday') {
        return 'friday';
    }
    else if (today_name === 'saturday') {
        return 'saturday';
    }
}
exports.getTodayName = getTodayName;
function diffMinutes(currentTime, logTime) {
    const current = typeof currentTime === 'string' ? new Date(currentTime) : currentTime;
    const log = typeof logTime === 'string' ? new Date(logTime) : logTime;
    const diffMs = current.getTime() - log.getTime();
    const diffMins1 = diffMs / 60000;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
}
exports.diffMinutes = diffMinutes;
function getCurrentFullDatenow() {
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
exports.getCurrentFullDatenow = getCurrentFullDatenow;
function getCurrentDatenow() {
    const now = new Date();
    const date = new Date(now);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
exports.getCurrentDatenow = getCurrentDatenow;
function getCurrentTimenow() {
    const now = new Date();
    const date = new Date(now);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
exports.getCurrentTimenow = getCurrentTimenow;
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const hh = hours < 10 ? '0' + hours : hours.toString();
    const mm = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${hh}:${mm}`;
    console.log(getCurrentTime());
}
exports.getCurrentTime = getCurrentTime;
function getCurrentTimeStatus(scheduleTime, schedule_event_start) {
    const toMinutes = (t) => {
        const [hh, mm] = t.split(':').map(Number);
        return hh * 60 + mm;
    };
    var consVae = 30;
    var MINUTES_IN_DAY = 1440;
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var scheduleMin = toMinutes(scheduleTime);
    var schedule_event_start_set1 = toMinutes(scheduleTime);
    var schedule_event_start_set2 = toMinutes(schedule_event_start);
    if (schedule_event_start_set1 == schedule_event_start_set2) {
        var windowStart = schedule_event_start_set2;
    }
    else {
        var windowStart = nowMin;
    }
    const windowEnd = (nowMin + consVae) % MINUTES_IN_DAY;
    var cons1 = 1;
    var cons2 = 0;
    var cons11 = `1- ${scheduleMin} - In the period ` +
        windowStart +
        `:00 ± ` +
        consVae +
        ` minute`;
    var cons22 = `2- ${scheduleMin} - Out of range ` +
        windowStart +
        `:00 ± ` +
        consVae +
        ` minute`;
    var count_time = schedule_event_start_set1 - schedule_event_start_set2;
    if (scheduleMin >= windowStart) {
        var rt = 'scheduleMin>=windowStart';
    }
    else if (scheduleMin <= windowEnd) {
        var rt = 'scheduleMin>=windowEnd';
    }
    if (windowEnd >= windowStart) {
        if (count_time >= 0) {
            if ((count_time == 0 || count_time <= consVae) && count_time >= 0) {
                var status = 1;
            }
            else {
                var status = 0;
            }
        }
        else {
            var status = 0;
        }
    }
    else {
        var status = 0;
    }
    return status;
}
exports.getCurrentTimeStatus = getCurrentTimeStatus;
function getCurrentTimeStatusMsg(scheduleTime, schedule_event_start) {
    const toMinutes = (t) => {
        const [hh, mm] = t.split(':').map(Number);
        return hh * 60 + mm;
    };
    var consVae = 30;
    var MINUTES_IN_DAY = 1440;
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var scheduleMin = toMinutes(scheduleTime);
    var schedule_event_start_set1 = toMinutes(scheduleTime);
    var schedule_event_start_set2 = toMinutes(schedule_event_start);
    if (schedule_event_start_set1 == schedule_event_start_set2) {
        var windowStart = schedule_event_start_set2;
    }
    else {
        var windowStart = nowMin;
    }
    const windowEnd = (nowMin + consVae) % MINUTES_IN_DAY;
    var cons1 = 1;
    var cons2 = 0;
    var cons11 = `1- ${scheduleMin} - In the period ` +
        windowStart +
        `:00 ± ` +
        consVae +
        ` minute`;
    var cons22 = `2- ${scheduleMin} - Out of range ` +
        windowStart +
        `:00 ± ` +
        consVae +
        ` minute`;
    var count_time = schedule_event_start_set1 - schedule_event_start_set2;
    if (scheduleMin >= windowStart) {
        var rt = 'scheduleMin>=windowStart';
    }
    else if (scheduleMin <= windowEnd) {
        var rt = 'scheduleMin>=windowEnd';
    }
    if (windowEnd >= windowStart) {
        if (count_time >= 0) {
            if ((count_time == 0 || count_time <= consVae) && count_time >= 0) {
                var status = 1;
            }
            else {
                var status = 0;
            }
        }
        else {
            var status = 0;
        }
    }
    else {
        var status = 0;
    }
    var dataset1 = {
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
}
exports.getCurrentTimeStatusMsg = getCurrentTimeStatusMsg;
function timeConverter(UNIX_timestamp) {
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
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
exports.timeConverter = timeConverter;
function toThaiDate(date) {
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
exports.toThaiDate = toThaiDate;
function toEnDate(date) {
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
exports.toEnDate = toEnDate;
function getRandomint(length) {
    var randomChars = '0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.getRandomint = getRandomint;
function AlarmDetailValidate(dto) {
    var _a, _b;
    try {
        var case1 = 'Warning';
        var case2 = 'Critical';
        var case3 = 'Recovery Warning';
        var case4 = 'Recovery Critical';
        var case5 = 'Normal';
        var case6 = 'Normal';
        var case7 = 'Unknown';
        var case7 = 'Critical Highest! Maximum limit.';
        var case8 = 'Critical Highest! Minimum limit';
        console.log('getAlarmDetails dto-->', dto);
        var timestamp = nowdatetime();
        const unit = dto.unit || '';
        let type_id = dto.type_id ? parseFloat(dto.type_id) : 0;
        if (dto.alarmTypeId) {
            type_id = parseFloat(dto.hardware_id);
        }
        let sensorValues = dto.value_data;
        if (sensorValues !== null &&
            sensorValues !== undefined &&
            sensorValues !== '') {
            const sensorValueNum = parseFloat(sensorValues);
            if (!isNaN(sensorValueNum)) {
                sensorValues = sensorValueNum;
            }
        }
        var max = (_a = dto.max) !== null && _a !== void 0 ? _a : '';
        var min = (_b = dto.min) !== null && _b !== void 0 ? _b : '';
        const statusAlert = parseFloat(dto.status_alert) || 0;
        const statusWarning = parseFloat(dto.status_warning) || 0;
        const recoveryWarning = parseFloat(dto.recovery_warning) || 0;
        const recoveryAlert = parseFloat(dto.recovery_alert) || 0;
        const mqttName = '';
        const deviceName = dto.device_name || '';
        const alarmActionName = dto.action_name || '';
        const mqttControlOn = dto.mqtt_control_on || '';
        const mqttControlOff = dto.mqtt_control_off || '';
        const count_alarm = parseFloat(dto.count_alarm) || 0;
        const event = parseFloat(dto.event) || 0;
        let dataAlarm = 999;
        let eventControl = event;
        let messageMqttControl = event === 1 ? mqttControlOn : mqttControlOff;
        let alarmStatusSet = 999;
        let subject = '';
        let content = '';
        let status = 5;
        let data_alarm = 0;
        let value_data = dto.value_data;
        let value_alarm = dto.value_alarm || '';
        let value_relay = dto.value_relay || '';
        let value_control_relay = dto.value_control_relay || '';
        let sensor_data = null;
        let title = case5;
        sensor_data = parseFloat(dto.value_data) || 0;
        const sensorValue = sensor_data;
        if ((sensorValue == 1 ||
            sensorValue == 0 ||
            sensorValue == 'ON' ||
            sensorValue == 'OFF' ||
            sensorValue == 'on' ||
            sensorValue == 'off') &&
            type_id == 3) {
            alarmStatusSet = 999;
            title = case5;
            subject = case5;
            content = case5;
            dataAlarm = 0;
            data_alarm = 0;
            status = 5;
        }
        else if (sensorValue != 1 && type_id == 4) {
            alarmStatusSet = 2;
            title = case2;
            subject = `${mqttName} ${case2} ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 2;
        }
        else if (sensorValue == 1 && type_id == 4) {
            alarmStatusSet = 999;
            title = case5;
            subject = case5;
            content = case5;
            dataAlarm = 0;
            data_alarm = 0;
            status = 5;
        }
        else if (max != '' &&
            sensorValue >= max &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 2;
            title = case7;
            subject = `${mqttName} ${case7}: ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case7}: ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 2;
        }
        else if (min != '' &&
            sensorValue <= min &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 1;
            title = case8;
            subject = `${mqttName} ${case8}: ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case8} : ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 1;
        }
        else if ((sensorValue > statusWarning || sensorValue === statusWarning) &&
            statusWarning < statusAlert &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 1;
            title = case1;
            subject = `${mqttName} ${case1} : ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case1}: ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 1;
        }
        else if ((sensorValue > statusAlert || sensorValue === statusAlert) &&
            statusAlert > statusWarning &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 2;
            title = case2;
            subject = `${mqttName} ${case2} : ${deviceName} :${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
            dataAlarm = statusAlert;
            data_alarm = statusAlert;
            status = 2;
        }
        else if (count_alarm >= 1 &&
            (sensorValue < recoveryWarning || sensorValue === recoveryWarning) &&
            recoveryWarning <= recoveryAlert &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 3;
            title = case3;
            subject = `${mqttName} ${case3} : ${deviceName} :${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case3}: ${deviceName} :${sensorValue}`;
            dataAlarm = recoveryWarning;
            data_alarm = recoveryWarning;
            eventControl = event === 1 ? 0 : 1;
            messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
            status = 3;
        }
        else if (count_alarm >= 1 &&
            (sensorValue < recoveryAlert || sensorValue === recoveryAlert) &&
            recoveryAlert >= recoveryWarning &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 4;
            title = `${mqttName} ${case4}`;
            subject = `${mqttName} ${case4} :${deviceName} :${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case4} : ${deviceName} :${sensorValue}`;
            dataAlarm = recoveryAlert;
            data_alarm = recoveryAlert;
            eventControl = event === 1 ? 0 : 1;
            messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
            status = 4;
        }
        else {
            alarmStatusSet = 999;
            title = case5;
            subject = case5;
            content = case5;
            dataAlarm = 0;
            data_alarm = 0;
            status = 5;
        }
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
        };
        return result;
    }
    catch (error) {
        console.error('Error in getAlarmDetails:', error);
        throw error;
    }
}
exports.AlarmDetailValidate = AlarmDetailValidate;
function AlarmDetailValidateTh(dto) {
    var _a, _b;
    var case1 = 'คำเตือนมีความผิดปกติ';
    var case2 = 'ภาวะวิกฤตต้องแก้ไขทันที';
    var case3 = 'คืนสู่ภาวะปกติ';
    var case4 = 'คืนสู่ภาวะปกติ';
    var case5 = 'ปกติ';
    var case6 = 'ปกติ';
    var case7 = 'ไม่ทราบสาเหตุ';
    var case7 = 'วิกฤตมีค่าสูงเกินกำหนด';
    var case8 = 'วิกฤตมีค่าต่ำกว่ากำหนด';
    try {
        console.log('getAlarmDetails dto-->', dto);
        var timestamp = nowdatetime();
        const unit = dto.unit || '';
        let type_id = dto.type_id ? parseFloat(dto.type_id) : 0;
        if (dto.alarmTypeId) {
            type_id = parseFloat(dto.hardware_id);
        }
        let sensorValues = dto.value_data;
        if (sensorValues !== null &&
            sensorValues !== undefined &&
            sensorValues !== '') {
            const sensorValueNum = parseFloat(sensorValues);
            if (!isNaN(sensorValueNum)) {
                sensorValues = sensorValueNum;
            }
        }
        var max = (_a = dto.max) !== null && _a !== void 0 ? _a : '';
        var min = (_b = dto.min) !== null && _b !== void 0 ? _b : '';
        const statusAlert = parseFloat(dto.status_alert) || 0;
        const statusWarning = parseFloat(dto.status_warning) || 0;
        const recoveryWarning = parseFloat(dto.recovery_warning) || 0;
        const recoveryAlert = parseFloat(dto.recovery_alert) || 0;
        const mqttName = '';
        const deviceName = dto.device_name || '';
        const alarmActionName = dto.action_name || '';
        const mqttControlOn = dto.mqtt_control_on || '';
        const mqttControlOff = dto.mqtt_control_off || '';
        const count_alarm = parseFloat(dto.count_alarm) || 0;
        const event = parseFloat(dto.event) || 0;
        let dataAlarm = 999;
        let eventControl = event;
        let messageMqttControl = event === 1 ? mqttControlOn : mqttControlOff;
        let alarmStatusSet = 999;
        let subject = '';
        let content = '';
        let status = 5;
        let data_alarm = 0;
        let value_data = dto.value_data;
        let value_alarm = dto.value_alarm || '';
        let value_relay = dto.value_relay || '';
        let value_control_relay = dto.value_control_relay || '';
        let sensor_data = null;
        let title = case5;
        sensor_data = parseFloat(dto.value_data) || 0;
        const sensorValue = sensor_data;
        if ((sensorValue == 1 ||
            sensorValue == 0 ||
            sensorValue == 'ON' ||
            sensorValue == 'OFF' ||
            sensorValue == 'on' ||
            sensorValue == 'off') &&
            type_id == 3) {
            alarmStatusSet = 999;
            title = case5;
            subject = case5;
            content = case5;
            dataAlarm = 0;
            data_alarm = 0;
            status = 5;
        }
        else if (sensorValue != 1 && type_id == 4) {
            alarmStatusSet = 2;
            title = case2;
            subject = `${mqttName} ${case2} ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 2;
        }
        else if (sensorValue == 1 && type_id == 4) {
            alarmStatusSet = 999;
            title = case5;
            subject = case5;
            content = case5;
            dataAlarm = 0;
            data_alarm = 0;
            status = 5;
        }
        else if (max != '' &&
            sensorValue >= max &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 2;
            title = case7;
            subject = `${mqttName} ${case7}: ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case7}: ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 2;
        }
        else if (min != '' &&
            sensorValue <= min &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 1;
            title = case8;
            subject = `${mqttName} ${case8}: ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case8} : ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 1;
        }
        else if ((sensorValue > statusWarning || sensorValue === statusWarning) &&
            statusWarning < statusAlert &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 1;
            title = case1;
            subject = `${mqttName} ${case1} : ${deviceName} : ${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case1}: ${deviceName} :${sensorValue}`;
            dataAlarm = statusWarning;
            data_alarm = statusWarning;
            status = 1;
        }
        else if ((sensorValue > statusAlert || sensorValue === statusAlert) &&
            statusAlert > statusWarning &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 2;
            title = case2;
            subject = `${mqttName} ${case2} : ${deviceName} :${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case2} : ${deviceName} :${sensorValue}`;
            dataAlarm = statusAlert;
            data_alarm = statusAlert;
            status = 2;
        }
        else if (count_alarm >= 1 &&
            (sensorValue < recoveryWarning || sensorValue === recoveryWarning) &&
            recoveryWarning <= recoveryAlert &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 3;
            title = case3;
            subject = `${mqttName} ${case3} : ${deviceName} :${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case3}: ${deviceName} :${sensorValue}`;
            dataAlarm = recoveryWarning;
            data_alarm = recoveryWarning;
            eventControl = event === 1 ? 0 : 1;
            messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
            status = 3;
        }
        else if (count_alarm >= 1 &&
            (sensorValue < recoveryAlert || sensorValue === recoveryAlert) &&
            recoveryAlert >= recoveryWarning &&
            (type_id == 1 || type_id == 2)) {
            alarmStatusSet = 4;
            title = `${mqttName} ${case4}`;
            subject = `${mqttName} ${case4} :${deviceName} :${sensorValue} ${unit}`;
            content = `${mqttName} ${alarmActionName} ${case4} : ${deviceName} :${sensorValue}`;
            dataAlarm = recoveryAlert;
            data_alarm = recoveryAlert;
            eventControl = event === 1 ? 0 : 1;
            messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
            status = 4;
        }
        else {
            alarmStatusSet = 999;
            title = case5;
            subject = case5;
            content = case5;
            dataAlarm = 0;
            data_alarm = 0;
            status = 5;
        }
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
        };
        return result;
    }
    catch (error) {
        console.error('Error in getAlarmDetails:', error);
        throw error;
    }
}
exports.AlarmDetailValidateTh = AlarmDetailValidateTh;
function getStatusCriticalEn(alarm_status) {
    var case1 = 'Normal';
    var case2 = 'Critical';
    var case7 = 'Unknown';
    switch (alarm_status) {
        case 1:
            return case1;
        case 0:
            return case2;
        default:
            return case7;
    }
}
exports.getStatusCriticalEn = getStatusCriticalEn;
function getStatusCriticalTh(alarm_status) {
    var case1 = 'ภาวะวิกฤตต้องแก้ไขทันที';
    var case2 = 'ปกติ';
    var case7 = 'ไม่ทราบสถานะ';
    switch (alarm_status) {
        case 1:
            return case1;
        case 0:
            return case2;
        default:
            return case7;
    }
}
exports.getStatusCriticalTh = getStatusCriticalTh;
function getStatusWarningEn(alarm_status) {
    var case1 = 'Normal';
    var case2 = 'Warning';
    var case7 = 'Unknown';
    switch (alarm_status) {
        case 1:
            return case1;
        case 0:
            return case2;
        default:
            return case7;
    }
}
exports.getStatusWarningEn = getStatusWarningEn;
function getStatusWarningTh(alarm_status) {
    var case1 = 'ปกติ';
    var case2 = 'คำเตือนเกิดภาวะผิดปกติ';
    var case7 = 'ไม่ทราบสถานะ';
    switch (alarm_status) {
        case 1:
            return case1;
        case 0:
            return case2;
        default:
            return case7;
    }
}
exports.getStatusWarningTh = getStatusWarningTh;
function getStatusIoEn(alarm_status) {
    var case1 = 'ON';
    var case2 = 'OFF';
    var case7 = 'Unknown';
    switch (alarm_status) {
        case 1:
            return case1;
        case 2:
            return case2;
        default:
            return case7;
    }
}
exports.getStatusIoEn = getStatusIoEn;
function getStatusIoTh(alarm_status) {
    var case1 = 'เปิด';
    var case2 = 'ปิด';
    var case7 = 'ไม่ทราบสถานะ';
    switch (alarm_status) {
        case 1:
            return case1;
        case 2:
            return case2;
        default:
            return case7;
    }
}
exports.getStatusIoTh = getStatusIoTh;
function getStatusTextEn(alarm_status) {
    var case1 = 'Warning';
    var case2 = 'Critical';
    var case3 = 'Recovery Warning';
    var case4 = 'Recovery Critical';
    var case5 = 'Normal';
    var case6 = 'Normal';
    var case7 = 'Unknown';
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
exports.getStatusTextEn = getStatusTextEn;
function getStatusTextTh(alarm_status) {
    var case1 = 'คำเตือนมีความผิดปกติ';
    var case2 = 'ภาวะวิกฤตต้องแก้ไขทันที';
    var case3 = 'คืนสู่ภาวะปกติ';
    var case4 = 'คืนสู่ภาวะปกติ';
    var case5 = 'ปกติ';
    var case6 = 'ปกติ';
    var case7 = 'ไม่ทราบสาเหตุ';
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
exports.getStatusTextTh = getStatusTextTh;
function getStatusInt(alarm_status) {
    var case1 = 1;
    var case2 = 2;
    var case3 = 3;
    var case4 = 4;
    var case5 = 5;
    var case6 = 999;
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
exports.getStatusInt = getStatusInt;
//# sourceMappingURL=iot.helper.js.map