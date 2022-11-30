
declare module '@ioc:Markdown/Config' {
    export interface MarkdownConfig {
        engine: string,
        engines: {
            [name: string]: any
        },
        enableManagedMarkdownFiles: boolean,
        drive: string
    }
}