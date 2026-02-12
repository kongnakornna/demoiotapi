export declare const enum PasswordCheckStrength {
    Short = 0,
    Common = 1,
    Weak = 2,
    Ok = 3,
    Strong = 4
}
export declare function getRandomString(length: any): any;
export declare function timeToMinutes(timeString: string): number;
export declare function diffMinutesFromNow(timeString: any): number;
export declare function getTodayName1(): string;
export declare function getCurrentDayname(): string;
export declare function getTodayName(): string;
export declare function diffMinutes(currentTime: string | Date, logTime: string | Date): number;
export declare function getCurrentFullDatenow(): string;
export declare function getCurrentDatenow(): string;
export declare function getCurrentTimenow(): string;
export declare function getCurrentTime(): string;
export declare function getCurrentTimeStatus(scheduleTime: string, schedule_event_start: string): any;
export declare function getCurrentTimeStatusMsg(scheduleTime: string, schedule_event_start: string): any;
export declare function timeConverter(UNIX_timestamp: any): string;
export declare function toThaiDate(date: any): string;
export declare function toEnDate(date: any): string;
export declare function getRandomint(length: any): any;
export declare function convertToTwoDecimals(num: any): number;
export declare function getRandomsrtsmall(length: any): any;
export declare function getRandomsrtsmallandint(length: any): any;
export declare function getRandomsrtbig(length: any): any;
export declare function getRandomsrtbigandsmall(length: any): any;
export declare function convertDatetime(utcString: any): string;
export declare function convertTZ(date: any, tzString: any): any;
export declare function timeConvertermas(a: any): any;
export declare function timeConvertermas2(a: any): any;
export declare function checkEmails(email: any): boolean;
export declare function CurrentDateTimeForSQL(): string;
export declare function getCurrentDateTimeForSQL(): string;
export declare function toSnakeCaseUpper(str: string): string;
export declare function convertSortInput(str: string): {
    sortField: string;
    sortOrder: string;
} | false;
export declare function getRandomStrings(length: any): any;
export declare function checkEmail(email: any): boolean;
export declare function MinimumLength(): number;
export declare function isPasswordCommon(password: string): boolean;
export declare function checkPasswordStrength1(password: any): void;
export declare function checkPasswordStrength(password: any): PasswordCheckStrength;
export declare function generatePassword(passwordLength: number): any;
export declare function passwordValidator(inputtxt: string): boolean;
export declare function shuffleArray(array: any): any;
export declare function shuffleArrayIfId(array: any, id: number): any;
export declare function getFormattedDate(date: any): string;
export declare function getDayname(): string;
export declare function getDaynameall(): string;
export declare function mapMqttDataToDeviceV2(dataDevices: any, mqttData: any): any;
export declare function mapMqttDataToDeviceALLMode(dataDevices: any, mqttData: any): any;
export declare function mapMqttDataToDeviceALL(dataDevices: any, mqttData: any): {
    dataDevices: any;
    mqttData: any;
};
export declare function mapMqttDataToDevices(dataDevices: any, mqttData: any): any;
export declare function mapMqttDataToDevice(dataDevices: any, mqttData: any): any;
export declare function mapMqttToDevice(devices: any, mqttData: any): any;
export declare function mapMqttToDevice1(devices: any, mqttData: any): any;
export declare function mergeDeviceDataWithMqtt(data1: any, data2: any): any;
export declare function checkAndFormatTwoDecimals(num: any): number;
export declare function hasMoreThanTwoDecimals(value: any): number;
export declare function safePromisify(fn: any): any;
export declare function safeparseFloat(value: any, defaultValue?: number): number;
export declare function safeParseFloat(value: any, defaultValue?: number): number;
