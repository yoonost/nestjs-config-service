import { Injectable } from '@nestjs/common'
import {ConfigClientService} from "nestjs-config-service";

@Injectable()
export class AppService {
    constructor(private readonly configClientService: ConfigClientService) {}

    getHello(): string | undefined  {
        return this.configClientService.get('description')
    }
}
