
import Config from '@ioc:Adonis/Core/Config'

export default class MarkdownController {
    public async index(ctx: any) {
        return ctx.view.render('adonis-markdown/managed-markdown/index')
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
            markdownFileObject.name = ctx.request.input('name')
            markdownFileObject.path = `${folder}/${markdownFile.fileName}` 
            markdownFileObject.isPublic = true

            if (ctx.auth.isLoggedIn) {
                markdownFileObject.userId = ctx.auth.user.id
                markdownFileObject.isPublic = ctx.request.input('is_public')
            }

            await markdownFileObject.save()

            return "UPLOADED"
        }

        return "NOT OK"
    }
}