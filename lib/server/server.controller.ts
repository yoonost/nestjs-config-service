import { Controller, Get, Param } from '@nestjs/common'
import { EnvironmentType } from '../interfaces/server'
import { ConfigServerService } from './server.service'
import { ConfigService } from '@nestjs/config'

// GET /environments - Returns all available environments
// GET /:environment/services - Returns all services for the specified environment
// GET /:environment/:service - Returns the configuration for a specific service in the specified environment

@Controller()
export class ConfigServerController {
    constructor(
        private readonly configServerService: ConfigServerService,
        private readonly configService: ConfigService,
    ) {}

    @Get(':environment/:service')
    public getServiceConfig(@Param('environment') environment: EnvironmentType, @Param('service') service: string): any {
        if (!this.configServerService.getOptions().environments.includes(environment)) {
            return { error: `Environment '${environment}' not found` }
        }

        const serviceConfig = this.configService['internalConfig'][service]
        if (!serviceConfig) {
            return { error: `Service '${service}' not found in environment '${environment}'` }
        }

        return serviceConfig
    }
}
