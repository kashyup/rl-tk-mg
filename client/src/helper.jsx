res.send({
    user: { id: user._id, username: user.username, email: user.email },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  });