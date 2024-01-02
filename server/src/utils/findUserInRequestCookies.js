const User = require("@/models/User");

const findUserInRequestCookies = async (req) => {
  try {
    const cookiesUser = JSON.parse(req.cookies.user);
    if (!cookiesUser) {
      return null;
    }
    const user = await User.findOne({ uid: cookiesUser.uid });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = findUserInRequestCookies;
