import { EnvironmentType } from './server.interface'

export interface ConfigClientInterface {
    hostname: string
    environment: EnvironmentType
    serviceName: string

    // retry
    // useragent
}
