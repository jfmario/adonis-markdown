
import Config from '@ioc:Adonis/Core/Config'

export default class MarkdownController {
    public async index(ctx: any) {

        const { default: MarkdownFile } = await import('../../Models/MarkdownFile')

        let userMarkdownFiles = [];
        let publicMarkdownFiles = [];

        if (ctx.auth.isLoggedIn) {
            userMarkdownFiles = await MarkdownFile
                .query()
                .where('user_id', ctx.auth.user.id)
            publicMarkdownFiles = await MarkdownFile
                .query()
                .whereNull('user_id')
                .orWhereNot('user_id', ctx.auth.user.id)
                .where('is_public', true)
        } else {
            publicMarkdownFiles = await MarkdownFile
                .query()
                .where('is_public', true)
        }

        return ctx.view.render('adonis-markdown/managed-markdown/index', {
            ctx,
            publicMarkdownFiles,
            userMarkdownFiles
        })
    }
    public async upload(ctx: any) {
        return ctx.view.render('adonis-markdown/managed-markdown/upload')
    }
    public async markdownFile(ctx: any) {

        const { default: MarkdownFile } = await import('../../Models/MarkdownFile')

        const markdownFile = ctx.request.file('md-file')
        if (markdownFile) {
            
            const currentDate = new Date()
            const folder = `/uploads/${currentDate.toISOString().split('T')[0]}`

            const markdownDriveName = Config.get('markdown.drive')
            await markdownFile.moveToDisk(folder, {}, markdownDriveName)

            const markdownFileObject = new MarkdownFile()
            markdownFileObject.name = ctx.request.input('name', "")
            markdownFileObject.path = `${folder}/${markdownFile.fileName}` 
            markdownFileObject.isPublic = true

            if (ctx.auth.use('web').isLoggedIn) {
                markdownFileObject.userId = ctx.auth.user.id
                markdownFileObject.isPublic = ctx.request.input('is_public', false)
            }

            await markdownFileObject.save()

            return ctx.response.redirect().toRoute('adonis-markdown.index')
        }

        // fix
        return "NOT OK"
    }
    public async render(ctx: any) {

        const { default: MarkdownFile } = await import('../../Models/MarkdownFile')

        const { default: Drive } = await import('@ioc:Adonis/Core/Drive')
        const { default: Markdown } = await import('@ioc:Markdown')
        
        const markdownFileId = ctx.params.id
        const markdownFile = await MarkdownFile.find(markdownFileId)

        let user = null

        if (markdownFile.userId) {
            const authGuard = Config.get('auth.guard')
            const authGuards = Config.get('auth.guards')
            const modelFn = authGuards[authGuard].provider.model
            const UserModel = await modelFn()
            user = await UserModel.default.find(markdownFile.userId)
        }

        const markdownDriveName: string = Config.get('markdown.drive')
        const mdContents = (await Drive.use(markdownDriveName).get(markdownFile.path)).toString()

        // read file
        const renderedHtml = await Markdown.render(mdContents)

        return ctx.view.render('adonis-markdown/managed-markdown/render', {
            markdownFile,
            renderedHtml,
            user
        })
    }
    public async editForm(ctx: any) {

        const { default: MarkdownFile } = await import('../../Models/MarkdownFile')
        const { default: Drive } = await import('@ioc:Adonis/Core/Drive')

        const markdownFileId = ctx.params.id
        const markdownFile = await MarkdownFile.find(markdownFileId)

        const markdownDriveName: string = Config.get('markdown.drive')
        const mdContents = (await Drive.use(markdownDriveName).get(markdownFile.path)).toString()

        // render form
    }
}