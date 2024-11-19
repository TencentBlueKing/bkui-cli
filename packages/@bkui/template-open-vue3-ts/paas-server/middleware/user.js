module.exports = async function user(req, res, next) {
  if (req.path !== '/api/user' && req.path !== '/user') {
    next();
    return;
  }
  const request = require('request');
  request(`${process.env.BK_LOGIN_URL}/api/v3/is_login/?bk_token=${req.cookies.bk_token}`, (err, response, body) => {
    if (err) {
      res.status(500);
      res.send('');
      return;
    }

    const data = JSON.parse(body || '{}');
    // 有登录状态
    if (data.result) {
      const {
        bk_username,
        avatar_url,
      } = data.data;
      res.json({
        code: 0,
        message: data.msg,
        data: {
          username: bk_username,
          avatar_url,
        },
      });
      return;
    }
    // 登录状态失效
    res.status(401);
    res.json({
      code: 401,
      message: data.msg,
    });
  });
};
