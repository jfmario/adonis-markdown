
import MarkdownIt from 'markdown-it';

export default class Markdown {

    private config: any = null
    private defaultEngineKey: string = 'default'
    private mdEngines: { [name: string] : MarkdownIt } = {}

    constructor() {

        
    }

    private async __configure() {
        if (this.config == null) {
            const { default: Config } = await import('@ioc:Adonis/Core/Config')
            this.config = Config.get('markdown')
            const defaultMdEngine = new MarkdownIt({ ...this.config.engines[this.config.engine] })
            this.defaultEngineKey = this.config.engine
            this.mdEngines[this.defaultEngineKey] = defaultMdEngine
        }
    }

    public testMessage() {
        return "MarkdownService works!"
    }

    public async render(text: string, engineKey: string = '') {

        await this.__configure()

        if (engineKey != this.defaultEngineKey) {
            if (!(engineKey in this.mdEngines)) {
                this.mdEngines[engineKey] = new MarkdownIt({...this.config[engineKey]})
            }
        }
        const engine: MarkdownIt = this.mdEngines[engineKey]
        console.log(engine)
        return engine.render(text)
    }
}