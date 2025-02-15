const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.authenticateAdmin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
      return  res.redirect('/admin/login');
  }

  try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      if(decoded.role == 'admin') {
      req.admin = decoded;

      next();
      }else{

    // Clear the token cookie to log the user out
    res.clearCookie('token');
    // Redirect to the login page after signing out
    res.redirect('/admin/login');

      }

  } catch (err) {
      return res.redirect('/admin/login');
  }
};



exports.isNotLoggedIn = (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect('/admin/dashboard'); // Redirect to dashboard if already logged in
        } catch (err) {
            // If token is invalid, allow access to login page
        }
    }

    next(); // Continue to login page if no valid token
};


exports.authenticateMember = (req, res, next) => {

    console.log(req.cookies)
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
    if (!token) {
        return  res.redirect('/admin/login');
    }
  
    try {
        if(decoded.role == 'member') {
            req.admin = decoded;
      
            next();
            }else{
      
          // Clear the token cookie to log the user out
          res.clearCookie('token');
          // Redirect to the login page after signing out
          res.redirect('/member/login');
      
            }
  
    } catch (err) {
        return         res.redirect('/member/login');
    }
  };