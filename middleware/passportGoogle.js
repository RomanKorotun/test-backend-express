import { Strategy } from "passport-google-oauth2";
import passport from "passport";
import { nanoid } from "nanoid";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import "dotenv/config";

const { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, BACKEND_URL } = process.env;

const googleOptions = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BACKEND_URL}/api/auth/google-redirect`,
  passReqToCallback: true,
};

const googleCallback = async (
  request,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const { email, displayName } = profile;
    const user = await User.findOne({ email });
    if (user) {
      return done(null, user);
    }
    const password = await bcryptjs.hash(nanoid(), 10);
    const newUser = await User.create({
      email,
      username: displayName,
      password,
      verify: true,
    });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

passport.use(new Strategy(googleOptions, googleCallback));

export default passport;
