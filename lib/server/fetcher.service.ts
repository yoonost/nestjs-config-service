import { Injectable, Logger } from '@nestjs/common'
import { ConfigServerStoragePathsInterface, ConfigServerStorageUrlsInterface } from '../interfaces/server'
import { extractFileNameWithoutExtension } from '../utils/extractFileNameWithoutExtension'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosResponse } from 'axios'
import { promises as fs } from 'fs'

@Injectable()
export class FetcherService {
    private readonly logger: Logger = new Logger(FetcherService.name)

    constructor(private readonly configService: ConfigService) {}

    public async fetchStoragePaths(paths: ConfigServerStoragePathsInterface[]): Promise<void> {
        for (const path of paths) {
            try {
                const fileContent: string = await fs.readFile(path.path, 'utf-8')
                const serviceName: string = path.service ? path.service : extractFileNameWithoutExtension(path.path)
                this.configService.set(serviceName, JSON.parse(fileContent))
            } catch (error) {
                this.logger.error(`Failed to read storage path: ${path.path}`, error)
            }
        }
    }

    public async fetchStorageUrls(urls: ConfigServerStorageUrlsInterface[]): Promise<void> {
        for (const url of urls) {
            try {
                const response: AxiosResponse = await axios.get(url.url, { headers: url.headers })
                const serviceName: string = url.service ? url.service : extractFileNameWithoutExtension(url.url)
                this.configService.set(serviceName, response.data)
            } catch (error) {
                this.logger.error(`Failed to fetch storage URL: ${url.url}`, error)
            }
        }
    }
}
