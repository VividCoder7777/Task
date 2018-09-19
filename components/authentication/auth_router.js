const router = require('express').Router();
const passport = require('passport');
require('./auth_config');

router.get('/login', (res, req, next)=>{
    
});

router.get('/logout', (res, req, next) => {
    
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
    })
);

// the second authenticate calls the callback in auth_config.js
router.get('/google/redirect', passport.authenticate('google'), (req, res, next) => {
    res.redirect('/');
})

module.exports = router;