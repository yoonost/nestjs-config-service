import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigClientInterface } from '../interfaces/client.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ConfigClientService implements OnModuleInit {
    private readonly options: ConfigClientInterface

    constructor(
        @Inject('CONFIG_CLIENT_OPTIONS')
        private readonly moduleOptions: ConfigClientInterface,
        private readonly configService: ConfigService,
    ) {
        this.options = moduleOptions
    }

    public async onModuleInit(): Promise<void> {
        this.configService.set('service-example', {
            name: 'Example Service',
            description: 'This is an example service configuration.',
            version: '1.0.0',
            environment: this.options.environment,
        })
    }

    public get<T = any>(key: string): T | undefined {
        return this.configService.get<T>(`service-example.${key}`)
    }

    public getOrThrow<T = any>(key: string): T {
        const value = this.get<T>(key);
        if (value === undefined) {
            throw new Error(`Configuration key '${key}' not found`);
        }
        return value;
    }

    public getOptions(): ConfigClientInterface {
        return this.options
    }
}
