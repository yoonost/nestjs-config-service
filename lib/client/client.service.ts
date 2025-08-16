import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigClientInterface } from '../interfaces/client.interface'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosResponse } from 'axios'

@Injectable()
export class ConfigClientService implements OnModuleInit {
    private readonly logger: Logger = new Logger(ConfigClientService.name)
    private readonly options: ConfigClientInterface

    constructor(
        @Inject('CONFIG_CLIENT_OPTIONS')
        private readonly moduleOptions: ConfigClientInterface,
        private readonly configService: ConfigService,
    ) {
        this.options = moduleOptions
    }

    public async onModuleInit(): Promise<void> {
        try {
            const response: AxiosResponse = await axios.get(`http://${this.options.hostname}/${this.options.environment}/${this.options.serviceName}`, {
                headers: { 'User-Agent': 'PostmanRuntime/7.45.0' },
            })
            this.logger.log(`Successfully resolved module configuration for ${this.options.serviceName}.`)
            this.configService.set(this.options.serviceName, response.data)
        } catch (error: unknown) {
            const message: any = error instanceof Error ? error : JSON.stringify(error)
            this.logger.error(`Failed to fetch configuration for service '${this.options.serviceName}'`, message)
        }
    }

    public get<T = any>(key: string): T | undefined {
        return this.configService.get<T>(`${this.options.serviceName}.${key}`)
    }

    public getOrThrow<T = any>(key: string): T {
        const value = this.get<T>(key)
        if (value === undefined) {
            throw new Error(`Configuration key '${key}' not found`)
        }
        return value
    }

    public getOptions(): ConfigClientInterface {
        return this.options
    }
}
