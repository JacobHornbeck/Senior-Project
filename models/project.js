const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: [
            "actionscript",
            "autohotkey",
            "batchfile",
            "c_cpp",
            "clojure",
            "cobol",
            "coffee",
            "csharp",
            "css",
            "django",
            "ejs",
            "erlang",
            "fortran",
            "fsharp",
            "golang",
            "groovy",
            "handlebars",
            "haskell",
            "html",
            "java",
            "javascript",
            "json",
            "kotlin",
            "less",
            "lisp",
            "lua",
            "markdown",
            "matlab",
            "mysql",
            "objectivec",
            "pascal",
            "perl",
            "php",
            "powershell",
            "python",
            "ruby",
            "rust",
            "sass",
            "scss",
            "sql",
            "sqlserver",
            "svg",
            "swift",
            "typescript",
            "xml"
        ]
    },
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Project', projectSchema)