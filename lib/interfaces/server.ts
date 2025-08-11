export type EnvironmentType = 'development' | 'testing' | 'staging' | 'production' | 'sandbox' | 'virtual'

export interface ConfigServerInterface {
    environments: EnvironmentType[]
    storage: {
        paths?: ConfigServerStoragePathsInterface[]
        urls?: ConfigServerStorageUrlsInterface[]
    }
}

export interface ConfigServerStoragePathsInterface {
    service?: string
    path: string
}

export interface ConfigServerStorageUrlsInterface {
    service?: string
    url: string
    headers?: Record<string, string>
}
