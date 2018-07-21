const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

module.exports = (poolData, body, cb) => {

  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const { username } = body;
  const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: body.refreshToken });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return cognitoUser.refreshSession(refreshToken, (err, userSession) => {
    if (err) return cb(err);

    cognitoUser.signInUserSession = userSession;
    return cognitoUser.globalSignOut({
      onFailure(err2) {
        return cb(err2);
      },
      onSuccess(data) {
        return cb(null, data);
      },
    });

  });

};