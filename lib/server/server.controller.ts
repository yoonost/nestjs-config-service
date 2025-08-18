import { Controller, Get, Ip, Param } from '@nestjs/common'
import { EnvironmentType } from '../interfaces/server.interface'
import { ConfigServerService } from './server.service'
import { ConfigService } from '@nestjs/config'
import { UserAgent } from '../decorators/user-agent.decorator'
import { Authorization } from '../decorators/authorization.decorator'

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
    public getServiceConfigForEnvironment(@Param('environment') environment: EnvironmentType, @Param('service') service: string, @Ip() ipAddress: string, @UserAgent() userAgent: string, @Authorization() authorizationToken: string): any {
        if (!this.configServerService.getOptions().environments.includes(environment)) {
            return { error: `Environment '${environment}' not found` }
        }

        const serviceConfig: any = this.configService.get(`${environment}.${service}`)
        if (!serviceConfig) {
            return { error: `Service '${service}' not found in environment '${environment}'` }
        }

        const allowedIps: string[] | null = this.configServerService.getOptions()?.services?.[service]?.allowedIps || null
        if (allowedIps && !allowedIps.includes(ipAddress)) {
            return { error: `Access denied for service '${service}' from IP '${ipAddress}'` }
        }

        const allowedUserAgents: string[] | null = this.configServerService.getOptions()?.services?.[service]?.allowedUserAgents || null
        if (allowedUserAgents && !allowedUserAgents.includes(userAgent)) {
            return { error: `Access denied for service '${service}' from User-Agent '${userAgent}'` }
        }

        const allowedAuthTokens: string[] | null = this.configServerService.getOptions()?.services?.[service]?.allowedAuthTokens || null
        if (allowedAuthTokens && !allowedAuthTokens.includes(authorizationToken)) {
            return { error: `Access denied for service '${service}' due to invalid authentication token` }
        }

        return serviceConfig
    }
}
