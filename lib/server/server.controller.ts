import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Controller(':application')
export class ConfigServerController {
    constructor(private readonly configService: ConfigService) {}
}
