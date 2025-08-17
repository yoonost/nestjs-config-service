import { EnvironmentType } from './server.interface'

export interface ConfigClientInterface {
    hostname: string
    environment: EnvironmentType
    serviceName: string
    userAgent?: string
    timeout?: number
    retryAttempts?: number
    retryDelay?: number
}
