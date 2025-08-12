import { Controller, Get, Param } from '@nestjs/common'
import { EnvironmentType } from '../interfaces/server'
import { ConfigServerService } from './server.service'
import { ConfigService } from '@nestjs/config'

@Controller()
export class ConfigServerController {
    constructor(
        private readonly configServerService: ConfigServerService,
        private readonly configService: ConfigService,
    ) {}

    @Get('environments')
    public getEnvironments(): any {
        return this.configServerService.getOptions().environments
    }

    @Get(':environment/services')
    public getServicesForEnvironment(@Param('environment') environment: EnvironmentType): any {
        if (!this.configServerService.getOptions().environments.includes(environment)) {
            return { error: `Environment '${environment}' not found` }
        }
        return Object.keys(this.configService.get(environment) || {})
    }

    @Get(':environment/:service')
    public getServiceConfigForEnvironment(@Param('environment') environment: EnvironmentType, @Param('service') service: string): any {
        if (!this.configServerService.getOptions().environments.includes(environment)) {
            return { error: `Environment '${environment}' not found` }
        }

        const serviceConfig = this.configService.get(`${environment}.${service}`)
        if (!serviceConfig) {
            return { error: `Service '${service}' not found in environment '${environment}'` }
        }

        return serviceConfig
    }
}
