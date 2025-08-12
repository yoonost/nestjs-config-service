export type EnvironmentType = 'development' | 'testing' | 'staging' | 'production' | 'sandbox' | 'virtual'

export interface ConfigServerInterface {
    environments: EnvironmentType[]
    storage: {
        paths?: ConfigServerStoragePathsInterface[]
        urls?: ConfigServerStorageUrlsInterface[]
    }
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
    service?: string
}
