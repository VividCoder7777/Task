const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20/lib');
const User = require('../../server/models').User;

passport.serializeUser((user, done) => {
    console.log('2. SERIALIZING USER');
    console.log(user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('0. DESERIALIZING USER');
    console.log(id);
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
        console.log('1. FINDING ONE!');
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