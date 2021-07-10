/**
 * Twilio Syncのトークンを取得する
 * @param {*} context
 * @param {*} event
 * @param {*} callback
 */
// https://qiita.com/mobilebiz/items/89d8c0aa6a80dac1793f
exports.handler = function (context, event, callback) {
  const ACCOUNT_SID = context.ACCOUNT_SID;
  const SERVICE_SID = context.SYNC_SERVICE_SID;
  const API_KEY = context.TWILIO_API_KEY;
  const API_SECRET = context.TWILIO_API_SECRET;
  const IDENTITY = context.DOMAIN_NAME;
  const AccessToken = Twilio.jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const syncGrant = new SyncGrant({
    serviceSid: SERVICE_SID,
  });

  const accessToken = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);

  accessToken.addGrant(syncGrant);
  accessToken.identity = IDENTITY;

  const response = new Twilio.Response();

  // Build a mapping of headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Set headers in response
  response.setHeaders(headers);

  response.setBody({
    token: accessToken.toJwt(),
  });

  callback(null, response);
};
