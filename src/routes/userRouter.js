const express = require('express')
const userModel = require('../models/user_model')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { v4 } = require('uuid');

const router = express.Router()

const options = {
    usernameField: 'login',
    passwordField: 'password',
    userField: 'userName',
    accountIdField: 'accountId',
}

const verifyPassword = (user, password) => {
    return user.password === password
};

const verify = (login, password, done) => {
    userModel.findOne({ login: login }, (err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, { message: `Пользователь ${login} не найден` })
        }
        if (!verifyPassword(user, password)) {
            return done(null, false, { message: 'Не верный пароль' })
        }
        return done(null, user)
    })
}
passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user._id)
});

passport.deserializeUser((id, cb) => {
    userModel.findById(id, (err, user) => {
        if (err) return cb(err);
        return cb(null, user);
    });
}
);

router.get('/login', (req, res) => {
    res.render("login", { title: "Вход" });
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login' }), (req, res) => {
    console.log('req', req.user)
    res.redirect('/api/menu')
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        console.log('requestLogout', req)
        res.redirect('/');
    });
});

router.get('/registration', (req, res) => {
    res.render("registration", { title: "Регистрация" });
})

router.post('/registration', async (req, res) => {
    const { login, password, userName } = req.body;
    console.log(login, password, userName )
    const credits = new userModel({ accountId: v4(), userName, login, password })
    try {
        await credits.save()
        res.render("menu", { title: 'Добро пожаловать в Ваш личный кабинет' });
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'Не удалось войти в Ваш личный кабинет' })
    }
})

router.get('/me', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/user/login')
    }
    next()
},
    (req, res) => {
        res.render('profile', { user: req.user, title: 'Ваш профиль' })
    })

module.exports = router