import express from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { json } from 'body-parser';
import { accountRouter } from './routes/account';
import { profileRouter } from './routes/profile';
import { internshipRouter } from './routes/internship';
import { User } from './models/user';

// Load the .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configure passport's local strategy
const LocalStrategy = passportLocal.Strategy;

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(json());
app.use(session({
  secret: process.env.SECRET || '',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.session());
app.use(accountRouter);
app.use(profileRouter);
app.use(internshipRouter);

// Configure passport-local to use the MongoDB datbase when authenticating users
passport.use(new LocalStrategy(async (username, password, done) => {
  // Find the user
  const user = await User.findOne({ username: username });
  if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
  }

  // Verify the password
  const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== user.password) {
      return done(null, false, { message: 'Invalid username or password' });
  }

  return done(null, user);
}));

// Serialize the user ID to the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize the user ID from the session
passport.deserializeUser(async (id: string, done) => {
  const user = await User.findOne({ _id: id });
  done(null, user);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '');
mongoose.connection.on('connected', () => {
  console.log('[database] Connected to MongoDB');
});

let port = process.env.BACKEND_PORT || 8000;
app.listen(port, () => {
  console.log(`[server] Listening on port ${port}`);
});

