import { Injectable, Logger } from '@nestjs/common'
import { ConfigServerStoragePathsInterface, ConfigServerStorageUrlsInterface, FetchStorageResponseInterface } from '../interfaces/server'
import { extractFileNameWithoutExtension } from '../utils/extractFileNameWithoutExtension'
import axios, { AxiosResponse } from 'axios'
import { promises as fs } from 'fs'

@Injectable()
export class FetcherService {
    private readonly logger: Logger = new Logger(FetcherService.name)

    public async fetchStoragePaths(paths: ConfigServerStoragePathsInterface[]): Promise<FetchStorageResponseInterface[]> {
        return await Promise.all(
            (paths || []).map(async (path: ConfigServerStoragePathsInterface): Promise<FetchStorageResponseInterface> => {
                const serviceName: string = path.serviceName || extractFileNameWithoutExtension(path.path)
                try {
                    const fileContent: string = await fs.readFile(path.path, 'utf-8')
                    return { serviceName, serviceEnvironments: path.environments, configData: JSON.parse(fileContent) }
                } catch (error) {
                    this.logger.error(`Failed to fetch storage URL: ${path.path}`, error)
                    return { serviceName, serviceEnvironments: path.environments, configData: {} }
                }
            }),
        )
    }

    public async fetchStorageUrls(urls: ConfigServerStorageUrlsInterface[]): Promise<FetchStorageResponseInterface[]> {
        return await Promise.all(
            (urls || []).map(async (url: ConfigServerStorageUrlsInterface): Promise<FetchStorageResponseInterface> => {
                const serviceName: string = url.serviceName || extractFileNameWithoutExtension(url.url)
                try {
                    const response: AxiosResponse = await axios.get(url.url, { headers: url.headers })
                    return { serviceName, serviceEnvironments: url.environments, configData: response.data }
                } catch (error) {
                    this.logger.error(`Failed to fetch storage URL: ${url.url}`, error)
                    return { serviceName, serviceEnvironments: url.environments, configData: {} }
                }
            }),
        )
    }
}
