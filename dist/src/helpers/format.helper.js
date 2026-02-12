"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMqttToDevice = exports.mapMqttDataToDevice = exports.mapMqttDataToDevices = exports.mapMqttDataToDeviceALL = exports.mapMqttDataToDeviceALLMode = exports.mapMqttDataToDeviceV2 = exports.getDaynameall = exports.getDayname = exports.getFormattedDate = exports.shuffleArrayIfId = exports.shuffleArray = exports.passwordValidator = exports.generatePassword = exports.checkPasswordStrength = exports.checkPasswordStrength1 = exports.isPasswordCommon = exports.MinimumLength = exports.checkEmail = exports.getRandomStrings = exports.convertSortInput = exports.toSnakeCaseUpper = exports.getCurrentDateTimeForSQL = exports.CurrentDateTimeForSQL = exports.checkEmails = exports.timeConvertermas2 = exports.timeConvertermas = exports.convertTZ = exports.convertDatetime = exports.getRandomsrtbigandsmall = exports.getRandomsrtbig = exports.getRandomsrtsmallandint = exports.getRandomsrtsmall = exports.convertToTwoDecimals = exports.getRandomint = exports.toEnDate = exports.toThaiDate = exports.timeConverter = exports.getCurrentTimeStatusMsg = exports.getCurrentTimeStatus = exports.getCurrentTime = exports.getCurrentTimenow = exports.getCurrentDatenow = exports.getCurrentFullDatenow = exports.diffMinutes = exports.getTodayName = exports.getCurrentDayname = exports.getTodayName1 = exports.diffMinutesFromNow = exports.timeToMinutes = exports.getRandomString = void 0;
exports.safeParseFloat = exports.safeparseFloat = exports.safePromisify = exports.hasMoreThanTwoDecimals = exports.checkAndFormatTwoDecimals = exports.mergeDeviceDataWithMqtt = exports.mapMqttToDevice1 = void 0;
const moment = require('moment');
const tz = require('moment-timezone');
const passwordConfig = Object.freeze({
    minLength: 8,
    atleaseOneLowercaseChar: true,
    atleaseOneUppercaseChar: true,
    atleaseOneDigit: true,
    atleaseOneSpecialChar: true,
});
function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.getRandomString = getRandomString;
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
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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
    const today_name = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
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
    const current = (typeof currentTime === 'string') ? new Date(currentTime) : currentTime;
    const log = (typeof logTime === 'string') ? new Date(logTime) : logTime;
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
    var cons11 = `1- ${scheduleMin} - In the period ` + windowStart + `:00 ± ` + consVae + ` minute`;
    var cons22 = `2- ${scheduleMin} - Out of range ` + windowStart + `:00 ± ` + consVae + ` minute`;
    var count_time = schedule_event_start_set1 - schedule_event_start_set2;
    if (scheduleMin >= windowStart) {
        var rt = 'scheduleMin>=windowStart';
    }
    else if (scheduleMin <= windowEnd) {
        var rt = 'scheduleMin>=windowEnd';
    }
    if (windowEnd >= windowStart) {
        if (count_time >= 0) {
            if ((count_time == 0 || count_time <= consVae) && (count_time >= 0)) {
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
    var cons11 = `1- ${scheduleMin} - In the period ` + windowStart + `:00 ± ` + consVae + ` minute`;
    var cons22 = `2- ${scheduleMin} - Out of range ` + windowStart + `:00 ± ` + consVae + ` minute`;
    var count_time = schedule_event_start_set1 - schedule_event_start_set2;
    if (scheduleMin >= windowStart) {
        var rt = 'scheduleMin>=windowStart';
    }
    else if (scheduleMin <= windowEnd) {
        var rt = 'scheduleMin>=windowEnd';
    }
    if (windowEnd >= windowStart) {
        if (count_time >= 0) {
            if ((count_time == 0 || count_time <= consVae) && (count_time >= 0)) {
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
function convertToTwoDecimals(num) {
    return parseFloat(num.toFixed(2));
}
exports.convertToTwoDecimals = convertToTwoDecimals;
function getRandomsrtsmall(length) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.getRandomsrtsmall = getRandomsrtsmall;
function getRandomsrtsmallandint(length) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.getRandomsrtsmallandint = getRandomsrtsmallandint;
function getRandomsrtbig(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.getRandomsrtbig = getRandomsrtbig;
function getRandomsrtbigandsmall(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!#@';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.getRandomsrtbigandsmall = getRandomsrtbigandsmall;
function convertDatetime(utcString) {
    const date = new Date(utcString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}:${hours}:${minutes}:${seconds}`;
}
exports.convertDatetime = convertDatetime;
function convertTZ(date, tzString) {
    var time = new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
        timeZone: tzString,
    }));
    return time;
}
exports.convertTZ = convertTZ;
function timeConvertermas(a) {
    let year = a.getFullYear();
    var month = (a.getMonth() + 1).toString().padStart(2, '0');
    var date = a.getDate().toString().padStart(2, '0');
    var hour = a.getHours().toString().padStart(2, '0');
    var min = a.getMinutes().toString().padStart(2, '0');
    var sec = a.getSeconds().toString().padStart(2, '0');
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
exports.timeConvertermas = timeConvertermas;
function timeConvertermas2(a) {
    let year = a.getFullYear();
    var month = (a.getMonth() + 1).toString().padStart(2, '0');
    var date = a.getDate().toString().padStart(2, '0');
    var hour = a.getHours().toString().padStart(2, '0');
    var min = a.getMinutes().toString().padStart(2, '0');
    var sec = a.getSeconds().toString().padStart(2, '0');
    var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
exports.timeConvertermas2 = timeConvertermas2;
function checkEmails(email) {
    const filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email)) {
        return false;
    }
    else {
        return true;
    }
}
exports.checkEmails = checkEmails;
function CurrentDateTimeForSQL() {
    const now = new Date();
    return now.toISOString();
}
exports.CurrentDateTimeForSQL = CurrentDateTimeForSQL;
function getCurrentDateTimeForSQL() {
    const now = new Date();
    return now.toISOString();
}
exports.getCurrentDateTimeForSQL = getCurrentDateTimeForSQL;
function toSnakeCaseUpper(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}
exports.toSnakeCaseUpper = toSnakeCaseUpper;
function convertSortInput(str) {
    const parts = str.split('-');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return false;
    }
    const sortField = parts[0]
        .replace(/[A-Z]/g, (letter) => `_${letter}`)
        .toUpperCase();
    const sortOrder = parts[1].toUpperCase();
    if (sortOrder !== 'ASC' && sortOrder !== 'DESC') {
        return false;
    }
    return { sortField, sortOrder };
}
exports.convertSortInput = convertSortInput;
function getRandomStrings(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.getRandomStrings = getRandomStrings;
function checkEmail(email) {
    const filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email)) {
        return false;
    }
    else {
        return true;
    }
}
exports.checkEmail = checkEmail;
function MinimumLength() {
    return 8;
}
exports.MinimumLength = MinimumLength;
function isPasswordCommon(password) {
    return this.commonPasswordPatterns.test(password);
}
exports.isPasswordCommon = isPasswordCommon;
function checkPasswordStrength1(password) {
    if (passwordConfig.minLength && password.length < passwordConfig.minLength) {
        throw new Error(`Your password must be at least ${passwordConfig.minLength} characters`);
    }
    if (passwordConfig.atleaseOneLowercaseChar && password.search(/[a-z]/i) < 0) {
        throw new Error('Your password must contain at least one lowercase character.');
    }
    if (passwordConfig.atleaseOneUppercaseChar && password.search(/[A-Z]/) < 0) {
        throw new Error('Your password must contain at least one uppercase character.');
    }
    if (passwordConfig.atleaseOneDigit && password.search(/[0-9]/) < 0) {
        throw new Error('Your password must contain at least one digit.');
    }
    if (passwordConfig.atleaseOneSpecialChar && password.search(/\W/) < 0) {
        throw new Error('Your password must contain at least one special character.');
    }
}
exports.checkPasswordStrength1 = checkPasswordStrength1;
function checkPasswordStrength(password) {
    let numberOfElements = 0;
    numberOfElements = /.*[a-z].*/.test(password)
        ? ++numberOfElements
        : numberOfElements;
    numberOfElements = /.*[A-Z].*/.test(password)
        ? ++numberOfElements
        : numberOfElements;
    numberOfElements = /.*[0-9].*/.test(password)
        ? ++numberOfElements
        : numberOfElements;
    numberOfElements = /[^a-zA-Z0-9]/.test(password)
        ? ++numberOfElements
        : numberOfElements;
    let currentPasswordStrength = 0;
    if (password === null || password.length) {
        currentPasswordStrength = 0;
    }
    else if (this.isPasswordCommon(password) === true) {
        currentPasswordStrength = 1;
    }
    else if (numberOfElements === 0 ||
        numberOfElements === 1 ||
        numberOfElements === 2) {
        currentPasswordStrength = 2;
    }
    else if (numberOfElements === 3) {
        currentPasswordStrength = 3;
    }
    else {
        currentPasswordStrength = 4;
    }
    return currentPasswordStrength;
}
exports.checkPasswordStrength = checkPasswordStrength;
function generatePassword(passwordLength) {
    var numberChars = '0123456789';
    var upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    var vaChars = '!@#$%^&*';
    var allChars = numberChars + upperChars + lowerChars + vaChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return shuffleArray(randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
    })).join('');
}
exports.generatePassword = generatePassword;
function passwordValidator(inputtxt) {
    var paswd = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})';
    if (inputtxt.match(paswd)) {
        return true;
    }
    else {
        return false;
    }
}
exports.passwordValidator = passwordValidator;
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
exports.shuffleArray = shuffleArray;
function shuffleArrayIfId(array, id) {
    return array.includes(id);
}
exports.shuffleArrayIfId = shuffleArrayIfId;
function getFormattedDate(date) {
    var dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayOfMonth = date.getDate();
    var dayOfWeekIndex = date.getDay();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return dayNames[dayOfWeekIndex] + ' ' + monthNames[monthIndex] + ' ' + dayOfMonth + ' ' + year;
}
exports.getFormattedDate = getFormattedDate;
function getDayname() {
    var date = new Date();
    var dayall = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    var today = date.toLocaleString('en-US', {
        weekday: 'long',
    });
    console.log('dayall=>');
    console.log(dayall);
    console.log('today=>');
    console.log(today);
    return today;
}
exports.getDayname = getDayname;
function getDaynameall() {
    var date = new Date();
    var dayall = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    console.log('dayall=>');
    console.log(dayall);
    return dayall;
}
exports.getDaynameall = getDaynameall;
function mapMqttDataToDeviceV2(dataDevices, mqttData) {
    return dataDevices.map(device => ({
        value_data: device.mqtt_device_name && Object.prototype.hasOwnProperty.call(mqttData, device.mqtt_device_name)
            ? mqttData[device.mqtt_device_name]
            : "",
        value_alarm: device.mqtt_status_over_name && Object.prototype.hasOwnProperty.call(mqttData, device.mqtt_status_over_name)
            ? mqttData[device.mqtt_status_over_name]
            : "",
        value_relay: device.mqtt_act_relay_name && Object.prototype.hasOwnProperty.call(mqttData, device.mqtt_act_relay_name)
            ? mqttData[device.mqtt_act_relay_name]
            : "",
        value_control_relay: device.mqtt_control_relay_name && Object.prototype.hasOwnProperty.call(mqttData, device.mqtt_control_relay_name)
            ? mqttData[device.mqtt_control_relay_name]
            : ""
    }));
}
exports.mapMqttDataToDeviceV2 = mapMqttDataToDeviceV2;
function mapMqttDataToDeviceALLMode(dataDevices, mqttData) {
    return mqttData;
}
exports.mapMqttDataToDeviceALLMode = mapMqttDataToDeviceALLMode;
function mapMqttDataToDeviceALL(dataDevices, mqttData) {
    return { dataDevices, mqttData };
}
exports.mapMqttDataToDeviceALL = mapMqttDataToDeviceALL;
function mapMqttDataToDevices(dataDevices, mqttData) {
    return dataDevices.map(device => {
        const mappedDevice = Object.assign({}, device);
        if (device.mqtt_device_name && mqttData.hasOwnProperty(device.mqtt_device_name)) {
            mappedDevice[device.mqtt_device_name] = mqttData[device.mqtt_device_name];
        }
        if (device.mqtt_status_over_name && mqttData.hasOwnProperty(device.mqtt_status_over_name)) {
            mappedDevice[device.mqtt_status_over_name] = mqttData[device.mqtt_status_over_name];
        }
        if (device.mqtt_act_relay_name && mqttData.hasOwnProperty(device.mqtt_act_relay_name)) {
            mappedDevice[device.mqtt_act_relay_name] = mqttData[device.mqtt_act_relay_name];
        }
        if (device.mqtt_control_relay_name && mqttData.hasOwnProperty(device.mqtt_control_relay_name)) {
            mappedDevice[device.mqtt_control_relay_name] = mqttData[device.mqtt_control_relay_name];
        }
        return mappedDevice;
    });
}
exports.mapMqttDataToDevices = mapMqttDataToDevices;
function mapMqttDataToDevice(dataDevices, mqttData) {
    return dataDevices.map(device => ({
        value_data: device.value_data && mqttData.hasOwnProperty(device.value_data)
            ? mqttData[device.value_data]
            : "",
        value_alarm: device.value_alarm && mqttData.hasOwnProperty(device.value_alarm)
            ? mqttData[device.value_alarm]
            : "",
        value_relay: device.value_relay && mqttData.hasOwnProperty(device.value_relay)
            ? mqttData[device.value_relay]
            : "",
        value_control_relay: device.value_control_relay && mqttData.hasOwnProperty(device.value_control_relay)
            ? mqttData[device.value_control_relay]
            : ""
    }));
}
exports.mapMqttDataToDevice = mapMqttDataToDevice;
function mapMqttToDevice(devices, mqttData) {
    return devices.map(device => {
        if (device.value_data && mqttData.hasOwnProperty(device.value_data)) {
            device[device.value_data] = mqttData[device.value_data];
        }
        if (device.value_alarm && mqttData.hasOwnProperty(device.value_alarm)) {
            device[device.value_alarm] = mqttData[device.value_alarm];
        }
        if (device.value_relay && mqttData.hasOwnProperty(device.value_relay)) {
            device[device.value_relay] = mqttData[device.value_relay];
        }
        if (device.value_control_relay && mqttData.hasOwnProperty(device.value_control_relay)) {
            device[device.value_control_relay] = mqttData[device.value_control_relay];
        }
        return device;
    });
}
exports.mapMqttToDevice = mapMqttToDevice;
function mapMqttToDevice1(devices, mqttData) {
    return devices.map(device => {
        device[device.value_data] = mqttData[device.value_data];
        device[device.value_alarm] = mqttData[device.value_alarm];
        device[device.value_relay] = mqttData[device.value_relay];
        device[device.value_control_relay] = mqttData[device.value_control_relay];
        return device;
    });
}
exports.mapMqttToDevice1 = mapMqttToDevice1;
function mergeDeviceDataWithMqtt(data1, data2) {
    return data1.map((device) => {
        const merged = Object.assign({}, device);
        Object.keys(data2).forEach((key) => {
            if (key === "bucket")
                return;
            if (key.toLowerCase().includes(device.device_name.toLowerCase()) ||
                (device.type_name &&
                    key.toLowerCase().includes(device.type_name.toLowerCase()))) {
                merged[key] = data2[key];
            }
        });
        return merged;
    });
}
exports.mergeDeviceDataWithMqtt = mergeDeviceDataWithMqtt;
function checkAndFormatTwoDecimals(num) {
    if (typeof num !== 'number') {
        const roundedNumree = parseFloat('0.00');
        return roundedNumree;
    }
    const roundedStr = num.toFixed(2);
    const roundedNum = Number(roundedStr);
    return roundedNum;
}
exports.checkAndFormatTwoDecimals = checkAndFormatTwoDecimals;
function hasMoreThanTwoDecimals(value) {
    const strValue = String(value);
    if (strValue.includes('.')) {
        const decimalPart = strValue.split('.')[1];
        const roundedNum = Number(value);
        return roundedNum;
    }
    const roundedNumree = Number(0.00);
    return roundedNumree;
}
exports.hasMoreThanTwoDecimals = hasMoreThanTwoDecimals;
function safePromisify(fn) {
    if (fn.constructor.name === 'AsyncFunction' ||
        (typeof fn === 'function' && fn.length === 1)) {
        return async (...args) => {
            return fn(...args);
        };
    }
    return fn;
}
exports.safePromisify = safePromisify;
function safeparseFloat(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
}
exports.safeparseFloat = safeparseFloat;
function safeParseFloat(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
}
exports.safeParseFloat = safeParseFloat;
//# sourceMappingURL=format.helper.js.map