"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxDBClient = void 0;
const { promisify } = require('util');
const axios = require('axios');
const moment = require('moment');
require("dotenv/config");
require('dotenv').config();
console.log('===============================influxdb Ready process================================================================');
const influxdb_client_1 = require("@influxdata/influxdb-client");
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
const influxDB = new influxdb_client_1.InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket);
writeApi.useDefaultTags({ region: 'west' });
const point = new influxdb_client_1.Point('temperature')
    .tag('sensor_id', 'TLM01')
    .floatField('value', 24.5);
writeApi.writePoint(point);
writeApi
    .close()
    .then(() => {
})
    .catch((err) => {
});
class InfluxDBClient {
}
exports.InfluxDBClient = InfluxDBClient;
//# sourceMappingURL=influxdb.js.map