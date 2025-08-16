import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import {ConfigClientModule} from "nestjs-config-service";

@Module({
    imports: [
        ConfigClientModule.forRoot({
            hostname: 'localhost',
            environment: 'development',
            serviceName: 'example-client-service',
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
