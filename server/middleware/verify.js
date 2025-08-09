import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const verify = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: 'No token found, authorization denied.',
      });
    }

    const decoded = jwt.verify(token, config.auth.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      authenticated: false,
      message: 'Invalid token, authorization denied.',
    });
  }
};

export default verify;