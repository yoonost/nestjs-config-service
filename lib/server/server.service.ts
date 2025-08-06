import { ConfigService } from '@nestjs/config'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigServerInterface } from '../interfaces/server'
import * as axios from 'axios'

@Injectable()
export class ConfigServerService {
    private readonly options: ConfigServerInterface
    private readonly logger: Logger = new Logger(ConfigServerService.name)

    constructor(
        @Inject('CONFIG_SERVER_OPTIONS') private readonly moduleOptions: ConfigServerInterface,
        private readonly configService: ConfigService,
    ) {
        this.options = moduleOptions
    }
}
