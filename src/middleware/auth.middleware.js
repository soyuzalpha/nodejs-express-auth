const { decodeFakeToken } = require("../utils/fakeToken");

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.replace("Bearer ", "");
  const decoded = decodeFakeToken(token);

  if (!decoded) return res.status(401).json({ message: "Invalid token" });

  if (decoded.exp < Date.now()) return res.status(401).json({ message: "Token expired" });

  req.user = decoded;
  next();
};

exports.role = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });

    next();
  };
};
