import { Injectable, Logger } from '@nestjs/common'
import { FileSourceInterface, UrlSourceInterface, FetchConfigResponseInterface } from '../interfaces/server.interface'
import axios, { AxiosResponse } from 'axios'
import { promises as fs } from 'fs'

@Injectable()
export class FetcherService {
    private readonly logger: Logger = new Logger(FetcherService.name)

    public async fetchFileSources(serviceName: string, sources: FileSourceInterface[]): Promise<FetchConfigResponseInterface[]> {
        return await Promise.all(
            (sources || []).map(async (source: FileSourceInterface): Promise<FetchConfigResponseInterface> => {
                try {
                    const fileContent: string = await fs.readFile(source.path, 'utf-8')
                    return { serviceName, environments: source.environments, configData: JSON.parse(fileContent) }
                } catch (error: unknown) {
                    const message: string = error instanceof Error ? error.message : JSON.stringify(error)
                    this.logger.error(`Failed to fetch storage URL: ${source.path}`, message)
                    return { serviceName, environments: source.environments, configData: {} }
                }
            }),
        )
    }

    public async fetchUrlSources(serviceName: string, sources: UrlSourceInterface[]): Promise<FetchConfigResponseInterface[]> {
        return await Promise.all(
            (sources || []).map(async (source: UrlSourceInterface): Promise<FetchConfigResponseInterface> => {
                try {
                    const response: AxiosResponse = await axios.get(source.url, { headers: source.headers })
                    return { serviceName, environments: source.environments, configData: response.data }
                } catch (error: unknown) {
                    const message: string = error instanceof Error ? error.message : JSON.stringify(error)
                    this.logger.error(`Failed to fetch storage URL: ${source.url}`, message)
                    return { serviceName, environments: source.environments, configData: {} }
                }
            }),
        )
    }
}
