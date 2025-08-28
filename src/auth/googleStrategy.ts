import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import googleModel from "../models/googleSchema"

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await googleModel.findOne({ googleId: profile.id });

        if (!user) {
          // New user → save in DB
          user = new googleModel({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails?.[0].value,
            avatar: profile.photos?.[0].value,
            accessToken, // ✅ save Google access token in DB
          });
          await user.save();
        } else {
          // Existing user → update access token
          user.accessToken = accessToken;
          await user.save();
        }

        // Pass user with token to passport
        return done(null, user);
      } catch (err) {
        return done(err as any, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id); // save only user id in session
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await googleModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

export default passport;
