import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getAddress(text: string) {
    return lastValueFrom(
      this.http
        .get(
          `https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${text}&apiKey=${this.config.get(
            'MYPTV_KEY',
          )}`,
        )
        .pipe(map((resp) => resp.data)),
    );
  }
}
