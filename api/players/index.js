const { setCors, getPlayers } = require('../shared/palworld.js');

module.exports = async function (context) {
  setCors(context);

  if (context.req?.method === 'OPTIONS') {
    context.res = {
      status: 200
    };
    return;
  }

  try {
    const payload = await getPlayers();
    context.res = {
      status: 200,
      headers: context.res.headers,
      jsonBody: payload
    };
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    context.res = {
      status: statusCode,
      headers: context.res.headers,
      jsonBody: { error: error?.message || 'Proxy request failed' }
    };
  }
};
