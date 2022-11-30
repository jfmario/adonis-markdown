declare module '@ioc:Markdown' {
    export interface Markdown {
        constructor(config: any): any
        testMessage(): string
        render(text: string, engineKey?: string): string
    }
}