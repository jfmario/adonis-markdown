
This has been configured!!!!!!!!

### Drive & Migration

If you want to enable the Markdown service to manage 
markdown files, configure a disk drive in `config/drive.ts` and supply its
name in `config/markdown.ts`.

This feature will also leverage the markdown_files migration, which is
defined in `database/migrations/1669132699150_markdown_files.ts`. This migration
assumes the existence of a `users` table
(or at least that can access `ctx.auth.user.id`) if a user logged in.

To ensure this, make sure that `App/Middleware/SilentAuth` is added to
the global middleware.

If you do not intend to use this feature, delete the migration file 
and don't configure a disk drive.
