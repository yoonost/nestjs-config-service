export type EnvironmentType = 'production' | 'development' | 'testing'
export type ConfigSourceType = FileSourceInterface | UrlSourceInterface

export interface FetchConfigResponseInterface {
    serviceName: string
    environments: EnvironmentType[]
    configData: any
}

export interface ConfigServerInterface {
    environments: EnvironmentType[]
    services: Record<string, ServiceConfigInterface>
    updateInterval?: number
}

export interface ServiceConfigInterface {
    allowedIps?: string[] // IP addresses allowed to access the service
    allowedUserAgents?: string[] // User-Agents allowed to access the service
    allowedAuthTokens?: string[] // Authentication tokens allowed to access the service
    validationRules?: any
    sources?: ConfigSourceType[]
}

export interface FileSourceInterface extends ServiceConfigSourceBaseInterface {
    type: 'file'
    path: string
}

export interface UrlSourceInterface extends ServiceConfigSourceBaseInterface {
    type: 'url'
    url: string
    headers?: Record<string, string>
}

export interface ServiceConfigSourceBaseInterface {
    environments: EnvironmentType[]
}
