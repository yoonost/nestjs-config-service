import { basename } from 'path'

export function extractFileNameWithoutExtension(pathOrUrl: string): string {
    try {
        let fileName: string

        if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
            const url = new URL(pathOrUrl)
            fileName = basename(url.pathname)
        } else {
            fileName = basename(pathOrUrl)
        }

        return fileName.replace(/\.[^/.]+$/, '')
    } catch {
        return pathOrUrl
    }
}
