
import { ApplicationContract } from '@ioc:Adonis/Core/Application';

import Markdown from '../src/Markdown'
import MarkdownController from '../src/Controllers/Http/MarkdownController'

export default class MarkdownProvider {

    constructor(protected app: ApplicationContract) {}

    public static needsApplication = true

    public register() {
        // console.log('REGISTER');
        this.app.container.singleton('Markdown', function() {
            return new Markdown()
        })
        this.app.container.singleton('Markdown/MarkdownController', () => {
            return new MarkdownController()
        })
    }

    public async boot() {
        
        const { default: Config } = await import ('@ioc:Adonis/Core/Config')

        if (Config.get('markdown.enableManagedMarkdownFiles', false)) {
            
            const { default: Route } = await import('@ioc:Adonis/Core/Route')
            const { default: MarkdownController } = await import('@ioc:Markdown/MarkdownController')
            
            const mountPath = Config.get('markdown.uiMountPath', '/md')
            Route.group(() => {
                Route.get('/', async function(ctx) {
                    return await MarkdownController.index(ctx)
                }).as('index')
                Route.get('/render/:id', async function(ctx) {
                    return await MarkdownController.render(ctx)
                }).as('render')
                Route.get('/upload', async function(ctx) {
                    return await MarkdownController.upload(ctx)
                }).as('upload')
                Route.post('/markdown-file', async function(ctx) {
                    return await MarkdownController.markdownFile(ctx)
                }).as('markdown-file')
            })
            .prefix(mountPath)
            .as('adonis-markdown')
            
        }
    }
}