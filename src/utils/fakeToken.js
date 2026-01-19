const generateFakeToken = (user) => {
  return Buffer.from(
    JSON.stringify({
      id: user.id,
      role: user.role,
      email: user.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 hari
    }),
  ).toString("base64");
};

const decodeFakeToken = (token) => {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    return null;
  }
};

module.exports = { generateFakeToken, decodeFakeToken };
