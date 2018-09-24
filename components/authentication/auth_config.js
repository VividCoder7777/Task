const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20/lib');
const User = require('../../server/models').User;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.use(
    new GoogleStrategy({
    // options
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        User.findOne({
            where: {googleId: profile.id}
        }).then(userExist => {
       
            if (!userExist){
         
                let user = new User({
                    googleId: profile.id,
                    username: profile.displayName
                });
                user.save()
                    .then(newUser => {
                        done(null, newUser);
                    });
            } else {
                done(null, userExist);
            }

        }).catch(error => {
            done(error, null);
            throw error;
        });
    })
);