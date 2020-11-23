import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

require('dotenv').config();

const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.jwtSecret);

    res.cookie('__token', token, {
      expire: new Date() + 999,
      secret: true,
      httpOnly: true,
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'Could not sign in' });
  }
};

const signout = (req, res) => {
  res.clearCookie('__token');
  return res.status(200).json({ message: 'Signed out' });
};

const requireSignin = expressJwt({
  secret: process.env.jwtSecret,
  userProperty: 'auth',
  getToken: function fromCookie(req) {
    if (req.cookies.__token) {
      return req.cookies.__token;
    }
    return null;
  },
  algorithms: ['sha1', 'RS256', 'HS256'],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile_id === req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized',
    });
  }
  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
