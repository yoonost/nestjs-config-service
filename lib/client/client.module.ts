import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigClientInterface } from '../interfaces/client.interface'
import { ConfigClientService } from './client.service'

@Module({})
export class ConfigClientModule {
    static forRoot(moduleOptions: ConfigClientInterface): DynamicModule {
        return {
            module: ConfigClientModule,
            providers: [
                {
                    provide: 'CONFIG_CLIENT_OPTIONS',
                    useValue: moduleOptions,
                },
                ConfigClientService,
            ],
            exports: [ConfigClientService],
            imports: [ConfigModule.forRoot()],
        }
    }
}
