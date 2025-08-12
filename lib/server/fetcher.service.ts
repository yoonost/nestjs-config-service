import { Injectable, Logger } from '@nestjs/common'
import { ConfigServerInterface, EnvironmentType } from '../interfaces/server'
import { extractFileNameWithoutExtension } from '../utils/extractFileNameWithoutExtension'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosResponse } from 'axios'
import { promises as fs } from 'fs'

@Injectable()
export class FetcherService {
    private readonly logger: Logger = new Logger(FetcherService.name)

    constructor(private readonly configService: ConfigService) {}

    public async fetchStoragePaths(options: ConfigServerInterface, overwrite: boolean): Promise<void> {
        for (const path of options.storage.paths || []) {
            try {
                const fileContent: string = await fs.readFile(path.path, 'utf-8')
                const serviceName: string = path.service ? path.service : extractFileNameWithoutExtension(path.path)
                for (const environment of path.environments) {
                    this.addServiceToEnvironment(options.environments, environment, serviceName, JSON.parse(fileContent), overwrite)
                }
            } catch (error) {
                this.logger.error(`Failed to read storage path: ${path.path}`, error)
            }
        }
    }

    public async fetchStorageUrls(options: ConfigServerInterface, overwrite: boolean): Promise<void> {
        for (const url of options.storage.urls || []) {
            try {
                const response: AxiosResponse = await axios.get(url.url, { headers: url.headers })
                const serviceName: string = url.service ? url.service : extractFileNameWithoutExtension(url.url)
                for (const environment of url.environments) {
                    this.addServiceToEnvironment(options.environments, environment, serviceName, response.data, overwrite)
                }
            } catch (error) {
                this.logger.error(`Failed to fetch storage URL: ${url.url}`, error)
            }
        }
    }

    private addServiceToEnvironment(configEnvironments: EnvironmentType[], serviceEnvironment: EnvironmentType, serviceName: string, data: any, overwrite: boolean): void {
        if (!configEnvironments.includes(serviceEnvironment)) {
            return this.logger.warn(`Environment '${serviceEnvironment}' not found in config environments. Cannot add service '${serviceName}'.`)
        }

        if (this.configService.get(`${serviceEnvironment}.${serviceName}`) && !overwrite) {
            this.logger.warn(`Service '${serviceName}' already exists in environment '${serviceEnvironment}'. Skipping addition.`)
        }

        if (overwrite) {
            this.configService.set(`${serviceEnvironment}.${serviceName}`, {})
        }

        const currentConfig: any = this.configService.get(serviceEnvironment) || {}
        this.configService.set(serviceEnvironment, { ...currentConfig, [serviceName]: data })

        this.logger.log(`Service '${serviceName}' ${overwrite ? 'rewritten' : 'added'} in environment '${serviceEnvironment}'`)
    }
}
