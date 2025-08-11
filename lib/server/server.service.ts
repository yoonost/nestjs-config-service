import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigServerInterface } from '../interfaces/server'
import { FetcherService } from './fetcher.service'

@Injectable()
export class ConfigServerService implements OnModuleInit {
    private readonly options: ConfigServerInterface

    constructor(
        @Inject('CONFIG_SERVER_OPTIONS') private readonly moduleOptions: ConfigServerInterface,
        private readonly fetcherService: FetcherService,
    ) {
        this.options = moduleOptions
    }

    public async onModuleInit(): Promise<void> {
        await Promise.all([this.fetcherService.fetchStoragePaths(this.options.storage.paths || []), this.fetcherService.fetchStorageUrls(this.options.storage.urls || [])])
    }

    public getOptions(): ConfigServerInterface {
        return this.options
    }
}
