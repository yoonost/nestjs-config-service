import { DynamicModule, Module } from '@nestjs/common'
import { ConfigServerInterface } from '../interfaces/server.interface'
import { ConfigServerController } from './server.controller'
import { ConfigServerService } from './server.service'
import { FetcherService } from './fetcher.service'
import { ConfigModule } from '@nestjs/config'

@Module({})
export class ConfigServerModule {
    static forRoot(moduleOptions: ConfigServerInterface): DynamicModule {
        return {
            module: ConfigServerModule,
            controllers: [ConfigServerController],
            providers: [
                {
                    provide: 'CONFIG_SERVER_OPTIONS',
                    useValue: moduleOptions,
                },
                ConfigServerService,
                FetcherService,
            ],
            exports: [ConfigServerService, FetcherService],
            imports: [ConfigModule],
        }
    }
}
