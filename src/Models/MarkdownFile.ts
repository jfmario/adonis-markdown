
import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class MarkdownFile extends BaseModel {

    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public userId: number

    @column()
    public path: string

    @column()
    public isPublic: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}