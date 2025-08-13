import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigServerInterface, EnvironmentType, FetchStorageResponseInterface } from '../interfaces/server'
import { validateSync, ValidationError } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { FetcherService } from './fetcher.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfigServerService implements OnModuleInit {
    private readonly logger: Logger = new Logger(ConfigServerService.name)
    private readonly options: ConfigServerInterface

    constructor(
        @Inject('CONFIG_SERVER_OPTIONS') private readonly moduleOptions: ConfigServerInterface,
        private readonly fetcherService: FetcherService,
        private readonly configService: ConfigService,
    ) {
        this.options = moduleOptions
    }

    public async onModuleInit(): Promise<void> {
        if (this.options.updateInterval && this.options.updateInterval > 0) {
            setInterval(() => {
                ;(async () => {
                    await this.fetchStorages(true)
                })().catch((err) => console.error(err))
            }, this.options.updateInterval)
        }
        await this.fetchStorages(false)
    }

    private async fetchStorages(overwrite: boolean = false): Promise<void> {
        const pathsData: FetchStorageResponseInterface[] = await this.fetcherService.fetchStoragePaths(this.options.storage.paths || [])
        const urlsData: FetchStorageResponseInterface[] = await this.fetcherService.fetchStorageUrls(this.options.storage.urls || [])

        for (const fetchData of [...pathsData, ...urlsData]) {
            if (this.options.services && this.options.services[fetchData.serviceName] && this.options.services[fetchData.serviceName].validation) {
                const validationClass: any = this.options.services[fetchData.serviceName].validation
                const validationInstance: unknown[] = plainToInstance(validationClass, fetchData.configData, { enableImplicitConversion: true })
                const errors: ValidationError[] = validateSync(validationInstance, { skipMissingProperties: false })

                if (errors.length > 0) {
                    this.logger.error(`Validation failed for service '${fetchData.serviceName}': ${errors.toString()}`)
                    continue
                }

                this.logger.log(`Validation passed for service '${fetchData.serviceName}'`)
            }
            for (const serviceEnvironment of fetchData.serviceEnvironments) {
                this.addServiceConfigToEnvironment(fetchData.serviceName, serviceEnvironment, fetchData.configData, overwrite)
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
        this.configService.set(serviceEnvironment, { ...currentConfig, [serviceName]: configData })
        this.logger.log(`Service '${serviceName}' ${overwrite ? 'rewritten' : 'added'} in environment '${serviceEnvironment}'`)
    }

    public getOptions(): ConfigServerInterface {
        return this.options
    }
}
