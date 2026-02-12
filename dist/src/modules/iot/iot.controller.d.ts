import { Request, Response } from 'express';
import { SettingsService } from '@src/modules/settings/settings.service';
import { IotsocketGateway } from '@src/modules/iot/iotsocket.gateway';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { AuthService } from '@src/modules/auth/auth.service';
import { RolesService } from '@src/modules/roles/roles.service';
import 'dotenv/config';
import { MqttService } from '@src/modules/mqtt/mqtt.service';
import 'dotenv/config';
declare const InfluxDB_url: string;
declare const InfluxDB_token: string;
declare const InfluxDB_org: string;
declare const InfluxDB_bucket: string;
declare const InfluxDB_username: string;
declare const InfluxDB_password: string;
export { InfluxDB_url, InfluxDB_token, InfluxDB_org, InfluxDB_bucket, InfluxDB_username, InfluxDB_password, };
import { IotService } from '@src/modules/iot/iot.service';
export declare class IotController {
    private readonly IotService;
    private settingsService;
    private readonly mqttService;
    private readonly rolesService;
    private usersService;
    private authService;
    private readonly jwtService;
    private readonly iotGateway;
    private readonly logger;
    constructor(IotService: IotService, settingsService: SettingsService, mqttService: MqttService, rolesService: RolesService, usersService: UsersService, authService: AuthService, jwtService: JwtService, iotGateway: IotsocketGateway);
    GetIndex(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    _getcachelist(res: Response, query: any): Promise<void>;
    getcachelist(res: Response, query: any): Promise<Response<any, Record<string, any>>>;
    getDeviceDatafan(res: Response, dto: any, query: any, headers: any, req: any): Promise<void>;
    getMqttlist(res: Response, dto: any, query: any, headers: any, req: any): Promise<void>;
    getMqttlistall(res: Response, dto: any, query: any, headers: any, req: any): Promise<void>;
    DeviceDataGet(res: Response, dto: any, query: any, headers: any, req: any): Promise<void>;
    device_control1(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    device_control(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    getDeviceData(res: Response, dto: any, query: any, headers: any, req: any): Promise<void>;
    DeviceData(res: Response, dto: any, query: any, headers: any, req: any): Promise<void>;
    device_control_data(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    device_get_data(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    sensercharts(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    senserchart(res: Response, query: any, headers: any, params: any, req: any): Promise<Response<any, Record<string, any>>>;
    getChartio(Dto: any): Promise<any>;
    getRandomsrtsmallandint(length: any): any;
    findIndex(): string;
    writeData(res: Response, req: any, body: {
        measurement: string;
        fields: Record<string, any>;
        tags?: Record<string, string>;
    }): Promise<{
        message: string;
    }>;
    getTemperatureData(res: Response, req: any, body: any): Promise<any>;
    getStartends(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    B1Data(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    sensers(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    senser(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getStartendchart(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getSenser(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getStartend(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getStartendlimit(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getGetone(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    getqueryFilterData(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    readDatafilters(res: Response, req: any, measurement: string, filters: string, timeRange: string): Promise<void>;
    readData(res: Response, req: any, body: {
        query: string;
    }): Promise<void>;
    queryData(res: Response, req: any, body: {
        query: string;
    }): Promise<void>;
    removemeasurement(res: Response, query: any, headers: any, params: any, req: any): Promise<void>;
    aircontrolPaginated(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    airmodelist(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    createairmod(res: Response, dto: any, DataDto: any, query: any, headers: any, params: any, req: any): Promise<string>;
    delete_airmod(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    updateairmodestatus(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updateairwarningstatus(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updateairmode(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    airperiodPaginated(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    createperiod(res: Response, dto: any, DataDto: any, query: any, headers: any, params: any, req: any): Promise<string>;
    updateperiod(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    delete_airperiod(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    updateperiodstatus(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    airsettingwarningPaginated(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    airwarningPaginated(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    createwarning(res: Response, dto: any, DataDto: any, query: any, headers: any, params: any, req: any): Promise<string>;
    updatewarning(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    delete_warning(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    mqttlogPaginated(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    updateaircontrolstatus(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updateairmodactive(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updatestatusairsettingwarning(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updateairsettingwarningactive(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updatestatusairwarning(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updateairwarningactive(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updatestatusairperiod(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updateairperiodactive(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    createaircontrol(res: Response, dto: any, DataDto: any, query: any, headers: any, params: any, req: any): Promise<string>;
    airmoddevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    delete_aircontrol(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    delete_alarm_event_Device(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    aircontroldevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    deleteaircontroldevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    airperioddevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    deleteairperioddevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    airsettingwarningdevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    deleteairsettingwarningdevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    airwarningdevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    deleteairwarningdevicemap(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    updateemailstatus(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    host_paginate(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    updatehost(res: Response, dto: any, req: any): Promise<Response<any, Record<string, any>>>;
    updatehoststatus(res: Response, dto: any, query: any, headers: any, params: any, req: any): Promise<void>;
    createhost(res: Response, dto: any, DataDto: any, query: any, headers: any, params: any, req: any): Promise<string>;
    deletehosts(res: Response, query: any, headers: any, params: any, req: any): Promise<any>;
    getDeviceStatus(deviceId: string): {
        deviceId: string;
        status: string;
        lastUpdate: string;
        message: string;
    };
    send(data: any): {
        data: any;
        status: string;
        received: boolean;
        lastUpdate: string;
        message: string;
    };
    controlDevice(commandDto: any): {
        success: boolean;
        message: string;
        data: any;
        timestamp: string;
    };
    updateConfig(id: string, configData: any): {
        id: string;
        updated: boolean;
        newConfig: any;
        timestamp: string;
    };
    getConnectedClients(): {
        message: string;
        endpoint: string;
    };
    healthCheck(): {
        status: string;
        gateway: string;
        timestamp: string;
        uptime: number;
    };
    wsBroadcast(data: {
        event: string;
        message: any;
    }, req: Request): Promise<{
        success: boolean;
        message: string;
        event?: undefined;
        sentTo?: undefined;
        timestamp?: undefined;
    } | {
        success: boolean;
        event: string;
        sentTo: number;
        message: string;
        timestamp: string;
    }>;
    wsSendByKey(data: {
        key: string;
        event: string;
        message: any;
    }, req: Request): Promise<{
        success: boolean;
        message: string;
        key?: undefined;
        event?: undefined;
        sent?: undefined;
        timestamp?: undefined;
    } | {
        success: boolean;
        key: string;
        event: string;
        sent: boolean;
        message: string;
        timestamp: string;
    }>;
    wsGetAllClients(): Promise<{
        success: boolean;
        message: string;
        endpoints: {
            websocket: string;
            events: {
                set_key: string;
                get_data: string;
                send_data: string;
            };
        };
        timestamp: string;
    }>;
    wsConnectedCount(): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    wsSendMqttData(data: {
        topic: string;
        payload: any;
    }, req: Request): Promise<{
        success: boolean;
        message: string;
        topic?: undefined;
        sentTo?: undefined;
        timestamp?: undefined;
    } | {
        success: boolean;
        topic: string;
        sentTo: number;
        message: string;
        timestamp: string;
    }>;
    wsSendNotification(data: {
        title: string;
        message: string;
        type?: 'info' | 'warning' | 'error' | 'success';
        key?: string;
    }, req: Request): Promise<any>;
    controlDeviceIO(commandDto: any): {
        success: boolean;
        message: string;
        data: any;
        timestamp: string;
    };
}
