import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserService } from '../services/user/user.service';
import { EnvironmentConfiguration } from '../config/env.config';

passport.use(
  new GoogleStrategy(
    {
      clientID: EnvironmentConfiguration.GOOGLE_CLIENT_ID,
      clientSecret: EnvironmentConfiguration.GOOGLE_CLIENT_SECRET,
      callbackURL: EnvironmentConfiguration.CALLBACK_URL,
      passReqToCallback: true, // Pass request object to callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('yaa samma ta pugya', refreshToken);

      try {
        const userService = new UserService();

        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('Google account does not have an email associated'));
        }

        // Check if user exists by Google ID
        let user = await userService.findByGoogleId(profile.id);

        if (!user) {
          // If not, register a new user
          user = await userService.createUser({
            firstName: profile.name?.givenName || 'FirstName',
            lastName: profile.name?.familyName || 'LastName',
            email: profile.emails[0].value,
            profilePicture: profile.photos?.[0]?.value || '',
            isEmailVerified: true, // Google verified email
            googleId: profile.id,
            refreshToken: refreshToken,
          });
          console.log('refreshToken', refreshToken);
        }

        done(null, user); // Pass user object for further JWT creation
      } catch (error) {
        console.log('Enver', EnvironmentConfiguration.GOOGLE_CLIENT_ID);
        console.log('Enver', EnvironmentConfiguration.GOOGLE_CLIENT_SECRET);
        console.log('Enver', EnvironmentConfiguration.CALLBACK_URL);
        done(error); // Handle errors
      }
    }
  )
);

export default passport;
