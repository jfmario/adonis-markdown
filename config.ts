
type MarkdownConfig = {
    engines: {
        [name: string]: any
    }
}

export function markdownConfig<T extends MarkdownConfig & { engine: keyof T['engines'] }>(config: T): T {
    return config
}