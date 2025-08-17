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
    webInterface?: WebInterfaceInterface
    updateInterval?: number
}

export interface ServiceConfigInterface {
    allowedIps?: string[]
    allowedUserAgents?: string[]
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

export interface WebInterfaceInterface {
    enabled?: boolean
    path?: string
    accessToken?: string
}
