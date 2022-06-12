require("dotenv").config()
const path = require("path")
const cors = require("cors")
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)

const app = express();
const authRoutes = require("./routes/auth")
const learnRoutes = require("./routes/learn")
const legalRoutes = require("./routes/legal")
const forumRoutes = require("./routes/forum")
const errorController = require("./controllers/error")

const User = require("./models/user")
const csrf = require("csurf")
const flash = require("connect-flash")
const multer = require("multer")

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
})
const csrfProtection = csrf()

const corsOptions = {
    origin: "https://genius-coding.herokuapp.com/",
    optionSuccessStatus: 200
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'product-images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    family: 4
}


app.set('view engine', 'ejs')
    .set('views', 'views')
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(multer({
        fileStorage
    }).single('image'))
    .use(express.static(path.join(__dirname, 'public')))
    .use(cors(corsOptions))
    .use(session({
        secret: 'this is the session encryption secret',
        resave: false,
        saveUninitialized: false,
        store: store
    }))
    .use(csrfProtection)
    .use(flash())
    // force HTTPS
    .use((req, res, next) => {
        if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
            return res.redirect('https://' + req.get('host') + req.url);
        }
        next();
    })
    .use((req, res, next) => {
        res.locals.isAuthenticated = req.session.isLoggedIn
        res.locals.csrfToken = req.csrfToken()
        res.locals.editorTheme = 'stackoverflow-dark'
        let temp1 = req.flash('message')
        res.locals.message = temp1.length > 0 ? temp1[0] : undefined
        let temp2 = req.flash('previous')
        res.locals.previous = temp2.length > 0 ? temp2[0] : undefined
        res.locals.path = req.url
        if (req.session.isLoggedIn) {
            res.locals.links = [
                { 'href': '/', 'text': 'Home' },
                { 'href': '/learn', 'text': 'Learn' },
                { 'href': '/code/new', 'text': 'Playground' },
                { 'href': '/logout', 'text': 'Logout' },
            ]
        } else {
            res.locals.links = [
                { 'href': '/', 'text': 'Home' },
                { 'href': '/learn', 'text': 'Learn' },
                { 'href': '/code/new', 'text': 'Playground' },
                { 'href': '/login', 'text': 'Login' },
                { 'href': '/signup', 'text': 'Sign Up' },
            ]
        }
        next()
    })
    .use((req, res, next) => {
        if (!req.session.user) return next()
        User.findById(req.session.user._id)
            .then((user) => {
                res.locals.editorTheme = user.editorTheme || 'stackoverflow-dark'
                res.locals.username = user.username
                req.user = user
                next()
            })
            .catch(err => {
                const error = new Error(err)
                error.httpStatusCode = 500
                return next(error)
            })
    })
    //    .use(routes)
    .use('/legal', legalRoutes)
    .use(learnRoutes)
    .use(authRoutes)
    .use(forumRoutes)
    .get('/500', errorController.get500)
    .get('/', (req, res, next) => {
        if (req.session.isLoggedIn) {
            User.findById(req.session.user._id)
                .then(user => {
                    res.render('homepage', {
                        pageTitle: 'Home',
                        user: {
                            firstname: user.firstName,
                            lastname: user.lastName,
                            email: user.email
                        },
                        courseCards: [
                            {
                                imgs: ['html','css'],
                                title: 'Build Your Website',
                                type: 'course',
                                thingId: 'abc123'
                            },
                            {
                                imgs: ['python'],
                                title: 'Python File Read/Write',
                                type: 'tutorial',
                                thingId: 'def456'
                            },
                            {
                                imgs: ['cpp'],
                                title: 'Solid C++',
                                type: 'course',
                                thingId: 'ghi789'
                            }
                        ],
                        projectCards: [],
                    })
                })
        }
        else {
            res.render('homepage', {
                pageTitle: 'Home',
                cards: [],
            })
        }
    })
    .use(errorController.get404)
    .use((error, req, res, next) => {
        console.log(error)
        res.redirect('/500')
    })

mongoose
    .connect(MONGODB_URL, options)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    })
    .catch(err => console.log(err))