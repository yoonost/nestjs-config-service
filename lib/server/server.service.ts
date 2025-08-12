import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigServerInterface } from '../interfaces/server'
import { FetcherService } from './fetcher.service'

@Injectable()
export class ConfigServerService implements OnModuleInit {
    private readonly logger: Logger = new Logger(ConfigServerService.name)
    private readonly options: ConfigServerInterface

    constructor(
        @Inject('CONFIG_SERVER_OPTIONS') private readonly moduleOptions: ConfigServerInterface,
        private readonly fetcherService: FetcherService,
    ) {
        this.options = moduleOptions
    }

    public async onModuleInit(): Promise<void> {
        if (this.options.updateInterval && this.options.updateInterval > 0) {
            setInterval(async (): Promise<void> => {
                await this.fetchStorage(true)
            }, this.options.updateInterval)
        }
        await this.fetchStorage()
    }

    private async fetchStorage(overwrite: boolean = false): Promise<void> {
        await this.fetcherService.fetchStoragePaths(this.options, overwrite)
        await this.fetcherService.fetchStorageUrls(this.options, overwrite)
    }

    public getOptions(): ConfigServerInterface {
        return this.options
    }
}
