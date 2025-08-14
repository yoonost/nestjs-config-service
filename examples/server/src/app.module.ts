import { Module } from '@nestjs/common'
import { ConfigServerModule } from 'nestjs-config-service'
import { ValidationService } from './validation'

@Module({
    imports: [
        ConfigServerModule.forRoot({
            environments: ['development', 'production'],
            services: {
                'example-one-service': {
                    allowedIps: ['::ffff:127.0.0.1'],
                    allowedUserAgents: ['PostmanRuntime/7.45.0'],
                    validationRules: ValidationService,
                    sources: [
                        {
                            type: 'file',
                            environments: ['development'],
                            path: 'E:\\repositories\\nestjs-config-service\\examples\\sources\\file-development.json',
                        },
                        {
                            type: 'file',
                            environments: ['production'],
                            path: 'E:\\repositories\\nestjs-config-service\\examples\\sources\\file-production.json',
                        },
                    ],
                },
                'example-two-service': {
                    allowedIps: ['::ffff:127.0.0.1'],
                    allowedUserAgents: ['PostmanRuntime/7.45.0'],
                    validationRules: ValidationService,
                    sources: [
                        {
                            type: 'url',
                            environments: ['development'],
                            url: 'https://raw.githubusercontent.com/yoonost/nestjs-config-service/refs/heads/main/examples/sources/url-development.json',
                        },
                        {
                            type: 'url',
                            environments: ['production'],
                            url: 'https://raw.githubusercontent.com/yoonost/nestjs-config-service/refs/heads/main/examples/sources/url-production.json',
                        },
                    ],
                },
            },
            updateInterval: 3600000,
        }),
    ],
})
export class AppModule {}
