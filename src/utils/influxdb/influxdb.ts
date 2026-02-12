import * as path from 'path';
import * as format from '@src/helpers/format.helper';
const { promisify } = require('util');
const axios = require('axios');
const moment = require('moment');
import 'dotenv/config';
require('dotenv').config();
// @influxdata/influxdb-client
// console.log('INFLUX_URL==='+process.env.INFLUX_URL);
// console.log('INFLUX_TOKEN==='+process.env.INFLUX_TOKEN);
// console.log('INFLUX_ORG==='+process.env.INFLUX_ORG);
// console.log('INFLUX_BUCKET==='+process.env.INFLUX_BUCKET);
// console.log('INFLUXDB_USERNAME==='+process.env.INFLUXDB_USERNAME);
// console.log('INFLUXDB_PASSWORD==='+process.env.INFLUXDB_PASSWORD);
//import {InfluxDB, Point} from '@influxdata/influxdb-client'
//const influxDB = new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN})
// console.log(
//   '===============================influxdb Client Start=============================================================',
// );
console.log(
  '===============================influxdb Ready process================================================================',
);

import { InfluxDB, Point } from '@influxdata/influxdb-client';
// Load environment variables
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

// Initialize InfluxDB client
const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket);
// console.log('influxDB==='+influxDB);
// console.log('writeApi==='+writeApi);
// Optional: Add default tags to points
writeApi.useDefaultTags({ region: 'west' });

// Create a data point and write it to the buffer
const point = new Point('temperature')
  .tag('sensor_id', 'TLM01')
  .floatField('value', 24.5);

// console.log(`Writing point: ${point}`)
writeApi.writePoint(point);

// Flush pending writes and close the client
writeApi
  .close()
  .then(() => {
    // console.log('Write completed successfully!')
  })
  .catch((err) => {
    // console.error('Error writing data:', err)
  });

export class InfluxDBClient {}
