import { ClassConstructor } from 'class-transformer'

export type EnvironmentType = 'development' | 'testing' | 'staging' | 'production' | 'sandbox' | 'virtual'

export interface ConfigServerInterface {
    environments: EnvironmentType[]
    storage: {
        paths?: ConfigServerStoragePathsInterface[]
        urls?: ConfigServerStorageUrlsInterface[]
    }
    validation?: Record<string, any>
    updateInterval?: number
}

export interface ConfigServerStoragePathsInterface extends ConfigServerStorageCommonInterface {
    path: string
}

export interface ConfigServerStorageUrlsInterface extends ConfigServerStorageCommonInterface {
    url: string
    headers?: Record<string, string>
}

export interface ConfigServerStorageCommonInterface {
    environments: EnvironmentType[]
    serviceName?: string
}

export interface FetchStorageResponseInterface {
    serviceName: string
    serviceEnvironments: EnvironmentType[]
    configData: any
}
