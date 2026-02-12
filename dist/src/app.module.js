"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_service_1 = require("./app.service");
const app_config_1 = __importDefault(require("./config/app.config"));
const db_1 = require("./config/db/db");
const passport_1 = require("@nestjs/passport");
const transform_interceptor_1 = require("../interceptors/transform.interceptor");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./modules/auth/auth.module");
const auth_guard_1 = require("./modules/auth/auth.guard");
const jwt_1 = require("@nestjs/jwt");
const jwt_2 = require("@nestjs/jwt");
const app_controller_1 = require("./app.controller");
const user_entity_1 = require("./modules/users/entities/user.entity");
const accessmenu_entity_1 = require("./modules/accessmenu/entities/accessmenu.entity");
const redis_module_1 = require("./modules/redis/redis.module");
const shared_module_1 = require("./modules/shared/shared.module");
const iot_module_1 = require("./modules/iot/iot.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const apps_module_1 = require("./modules/apps/apps.module");
const project_module_1 = require("./modules/project/project.module");
const events_module_1 = require("./modules/events/events.module");
const categories_module_1 = require("./modules/categories/categories.module");
const upcommingevents_module_1 = require("./modules/upcommingevents/upcommingevents.module");
const chat_module_1 = require("./modules/chat/chat.module");
const todo_module_1 = require("./modules/todo/todo.module");
const ticket_module_1 = require("./modules/ticket/ticket.module");
const api_key_module_1 = require("./modules/api-key/api-key.module");
const timeline_module_1 = require("./modules/timeline/timeline.module");
const monitoring_module_1 = require("./modules/monitoring/monitoring.module");
const maps_module_1 = require("./modules/maps/maps.module");
const settings_module_1 = require("./modules/settings/settings.module");
const chart_module_1 = require("./modules/chart/chart.module");
const crm_module_1 = require("./modules/crm/crm.module");
const hardware_module_1 = require("./modules/hardware/hardware.module");
const order_module_1 = require("./modules/order/order.module");
const package_module_1 = require("./modules/package/package.module");
const services_module_1 = require("./modules/services/services.module");
const ma_module_1 = require("./modules/ma/ma.module");
const invoice_module_1 = require("./modules/invoice/invoice.module");
const employee_module_1 = require("./modules/employee/employee.module");
const partner_module_1 = require("./modules/partner/partner.module");
const manual_module_1 = require("./modules/manual/manual.module");
const team_module_1 = require("./modules/team/team.module");
const report_module_1 = require("./modules/report/report.module");
const account_module_1 = require("./modules/account/account.module");
const hr_module_1 = require("./modules/hr/hr.module");
const roles_module_1 = require("./modules/roles/roles.module");
const sensor_module_1 = require("./modules/sensor/sensor.module");
const iotalarm_module_1 = require("./modules/iotalarm/iotalarm.module");
const calendar_module_1 = require("./modules/calendar/calendar.module");
const geo_module_1 = require("./modules/geo/geo.module");
const location_module_1 = require("./modules/location/location.module");
const snmp_module_1 = require("./modules/snmp/snmp.module");
const ai_module_1 = require("./modules/ai/ai.module");
const task_module_1 = require("./modules/task/task.module");
const syslog_module_1 = require("./modules/syslog/syslog.module");
const os_module_1 = require("./modules/os/os.module");
const mqtt_module_1 = require("./modules/mqtt/mqtt.module");
const mqtt2_module_1 = require("./modules/mqtt2/mqtt2.module");
const mqtt3_module_1 = require("./modules/mqtt3/mqtt3.module");
const ENV = process.env.NODE_ENV;
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: !ENV ? '.env.development' : `.env.${ENV}`,
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            typeorm_1.TypeOrmModule.forRootAsync(db_1.typeOrmAsyncConfig),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, accessmenu_entity_1.AccessMenu]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => redis_module_1.RedisModule),
            (0, common_1.forwardRef)(() => shared_module_1.SharedModule),
            config_1.ConfigModule.forRoot({
                load: [app_config_1.default],
                cache: true,
                envFilePath: [process.env.ENV_FILE, '.env.development'],
            }),
            jwt_2.JwtModule.registerAsync({
                global: true,
                useFactory: () => ({}),
            }),
            (0, common_1.forwardRef)(() => iot_module_1.IotModule),
            (0, common_1.forwardRef)(() => dashboard_module_1.DashboardModule),
            (0, common_1.forwardRef)(() => apps_module_1.AppsModule),
            (0, common_1.forwardRef)(() => project_module_1.ProjectModule),
            (0, common_1.forwardRef)(() => events_module_1.EventsModule),
            (0, common_1.forwardRef)(() => categories_module_1.CategoriesModule),
            (0, common_1.forwardRef)(() => upcommingevents_module_1.UpcommingeventsModule),
            (0, common_1.forwardRef)(() => chat_module_1.ChatModule),
            (0, common_1.forwardRef)(() => todo_module_1.TodoModule),
            (0, common_1.forwardRef)(() => ticket_module_1.TicketModule),
            (0, common_1.forwardRef)(() => api_key_module_1.ApiKeyModule),
            (0, common_1.forwardRef)(() => timeline_module_1.TimelineModule),
            (0, common_1.forwardRef)(() => monitoring_module_1.MonitoringModule),
            (0, common_1.forwardRef)(() => maps_module_1.MapsModule),
            (0, common_1.forwardRef)(() => settings_module_1.SettingsModule),
            (0, common_1.forwardRef)(() => syslog_module_1.SyslogModule),
            (0, common_1.forwardRef)(() => chart_module_1.ChartModule),
            (0, common_1.forwardRef)(() => crm_module_1.CrmModule),
            (0, common_1.forwardRef)(() => hardware_module_1.HardwareModule),
            (0, common_1.forwardRef)(() => order_module_1.OrderModule),
            (0, common_1.forwardRef)(() => package_module_1.PackageModule),
            (0, common_1.forwardRef)(() => services_module_1.ServicesModule),
            (0, common_1.forwardRef)(() => ma_module_1.MaModule),
            (0, common_1.forwardRef)(() => invoice_module_1.InvoiceModule),
            (0, common_1.forwardRef)(() => employee_module_1.EmployeeModule),
            (0, common_1.forwardRef)(() => partner_module_1.PartnerModule),
            (0, common_1.forwardRef)(() => manual_module_1.ManualModule),
            (0, common_1.forwardRef)(() => team_module_1.TeamModule),
            (0, common_1.forwardRef)(() => report_module_1.ReportModule),
            (0, common_1.forwardRef)(() => account_module_1.AccountModule),
            (0, common_1.forwardRef)(() => hr_module_1.HrModule),
            (0, common_1.forwardRef)(() => roles_module_1.RolesModule),
            (0, common_1.forwardRef)(() => sensor_module_1.SensorModule),
            (0, common_1.forwardRef)(() => iotalarm_module_1.IotalarmModule),
            (0, common_1.forwardRef)(() => calendar_module_1.CalendarModule),
            (0, common_1.forwardRef)(() => geo_module_1.GeoModule),
            (0, common_1.forwardRef)(() => location_module_1.LocationModule),
            (0, common_1.forwardRef)(() => snmp_module_1.SnmpModule),
            (0, common_1.forwardRef)(() => ai_module_1.AiModule),
            (0, common_1.forwardRef)(() => task_module_1.TaskModule),
            (0, common_1.forwardRef)(() => os_module_1.OsModule),
            (0, common_1.forwardRef)(() => mqtt_module_1.MqttModule),
            (0, common_1.forwardRef)(() => mqtt2_module_1.Mqtt2Module),
            (0, common_1.forwardRef)(() => mqtt3_module_1.Mqtt3Module),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            auth_guard_1.AuthGuard,
            jwt_1.JwtService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
        ],
        exports: [app_service_1.AppService, auth_guard_1.AuthGuard, jwt_1.JwtService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map