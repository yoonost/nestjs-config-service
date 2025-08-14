import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigServerInterface, ConfigSourceType, EnvironmentType, FetchConfigResponseInterface, FileSourceInterface, ServiceConfigInterface, UrlSourceInterface } from '../interfaces/server.interface'
import { validateSync, ValidationError } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { FetcherService } from './fetcher.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfigServerService implements OnModuleInit {
    private readonly logger: Logger = new Logger(ConfigServerService.name)
    private readonly options: ConfigServerInterface

    constructor(
        @Inject('CONFIG_SERVER_OPTIONS')
        private readonly moduleOptions: ConfigServerInterface,
        private readonly fetcherService: FetcherService,
        private readonly configService: ConfigService,
    ) {
        this.options = moduleOptions
    }

    public async onModuleInit(): Promise<void> {
        if (this.options.updateInterval && this.options.updateInterval > 0) {
            setInterval(() => {
                ;(async () => {
                    await this.fetchSources(true)
                })().catch((err) => console.error(err))
            }, this.options.updateInterval)
        }
        await this.fetchSources(false)
    }

    private async fetchSources(overwrite: boolean = false): Promise<void> {
        for (const serviceName in this.options.services) {
            const service: ServiceConfigInterface = this.options.services[serviceName]

            if (!service.sources || service.sources.length === 0) {
                this.logger.warn(`No sources defined for service '${serviceName}'. Skipping fetch.`)
                continue
            }

            const fetchFileData: FetchConfigResponseInterface[] = await this.fetcherService.fetchFileSources(
                serviceName,
                service.sources.filter((source: ConfigSourceType): source is FileSourceInterface => source.type === 'file'),
            )
            const fetchUrlData: FetchConfigResponseInterface[] = await this.fetcherService.fetchUrlSources(
                serviceName,
                service.sources.filter((source: ConfigSourceType): source is UrlSourceInterface => source.type === 'url'),
            )

            for (const data of [...fetchFileData, ...fetchUrlData]) {
                if (service.validationRules) {
                    const validationClass: any = service.validationRules
                    const validationInstance: unknown[] = plainToInstance(validationClass, data.configData, { enableImplicitConversion: true })
                    const errors: ValidationError[] = validateSync(validationInstance, { skipMissingProperties: false })

                    if (errors.length > 0) {
                        this.logger.error(`Validation failed for service '${serviceName}': ${errors.toString()}`)
                        continue
                    }

                    this.logger.log(`Validation passed for service '${serviceName}'`)
                }
                for (const serviceEnvironment of data.environments) {
                    this.addServiceConfigToEnvironment(data.serviceName, serviceEnvironment, data.configData, overwrite)
                }
            }
        }
    }

    private addServiceConfigToEnvironment(serviceName: string, serviceEnvironment: EnvironmentType, configData: any, overwrite: boolean = false): void {
        if (!this.options.environments.includes(serviceEnvironment)) {
            return this.logger.warn(`Environment '${serviceEnvironment}' not found in config environments. Cannot add service '${serviceName}'.`)
        } else if (this.configService.get(`${serviceEnvironment}.${serviceName}`) && !overwrite) {
            this.logger.warn(`Service '${serviceName}' already exists in environment '${serviceEnvironment}'. Skipping addition.`)
        }
        const currentConfig: any = this.configService.get(serviceEnvironment) || {}
        this.configService.set(serviceEnvironment, {
            ...currentConfig,
            [serviceName]: configData,
        })
        this.logger.log(`Service '${serviceName}' ${overwrite ? 'rewritten' : 'added'} in environment '${serviceEnvironment}'`)
    }

    public getOptions(): ConfigServerInterface {
        return this.options
    }
}
