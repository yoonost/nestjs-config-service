import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import {ConfigClientModule} from "nestjs-config-service";

@Module({
    imports: [
        ConfigClientModule.forRoot({
            hostname: '127.0.0.1:3000',
            environment: 'development',
            serviceName: 'example-one-service',
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
