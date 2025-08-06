export interface ConfigServerInterface {
    environment: 'development' | 'production' | 'test' | 'staging'
    storage: {
        paths?: ConfigServerStoragePathsInterface[]
        urls?: ConfigServerStorageUrlsInterface[]
        git?: ConfigServerStorageGitInterface[]
    }
    validation?: Record<string, unknown>
    updateInterval?: number
}

export interface ConfigServerStoragePathsInterface {
    path: string
}

export interface ConfigServerStorageUrlsInterface {
    url: string
}

export interface ConfigServerStorageGitInterface {
    repository: string
    branch?: string
    privateKey?: string
}