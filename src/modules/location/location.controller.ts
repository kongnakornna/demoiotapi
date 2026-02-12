import {
  Controller,
  Res,
  Post,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
  Get,
  UseGuards,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
  Req,
  Injectable,
  Headers,
  Header,
  DefaultValuePipe,
  ParseIntPipe,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
  PipeTransform,
  ArgumentMetadata,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response, NextFunction } from 'express';
import { Public } from '@src/modules/auth/auth.decorator';
var moment = require('moment');
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthUserRequired,
  auth,
  AuthTokenRequired,
} from '@src/modules/auth/auth.decorator';
import { LocationService } from './location.service';
import { SettingsService } from '@src/modules/settings/settings.service';
@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private settingsService: SettingsService,

  ) {}
  // http://172.25.99.60:3003/v1/location
  @HttpCode(200)
  //@AuthUserRequired()
  //@AuthUserRequired()
  @ApiOperation({ summary: 'location_all' })
  @Get()
  async location_all(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const dto: any = '';
    console.log(`dto=`);
    console.info(dto);
    let ResultData: any = await this.settingsService.location_all();
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: ResultData,
      message: 'location all success.',
      message_th: 'location all  success.',
    });
  }
  /*********************************/


  @Post()
  create(@Body() createLocationDto: any) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: any,
  ) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }

}
