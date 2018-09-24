const router = require('express').Router();
const passport = require('passport');
require('./auth_config');

router.get('/login', (res, req, next)=>{
    
});

router.get('/logout', (req, res, next) => {
    console.log('USER IS');
    console.log(req.user);
    res.clearCookie('login');
    req.logout();
    res.redirect('http://localhost:5000/');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
    })
);

// the second authenticate calls the callback in auth_config.js
router.get('/google/redirect', passport.authenticate('google'), (req, res, next) => {
    if (req.user){
        res.cookie('login','a2wi8cq09v1jwmdncksj9');
    } else {
        res.clearCookie('login');
    }
    res.redirect('http://localhost:5000/dashboard');
})

module.exports = router;