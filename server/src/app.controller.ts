import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAddress(@Query('searchText') search: string) {
    return this.appService.getAddress(search);
  }
}
