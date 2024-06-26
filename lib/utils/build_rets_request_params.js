const { DEFAULTS } = require('../constants.js');

const { md5 } = require('./common.js');

function BuildRetsRequestParams(configuration, cookies = {}, sessionId = '') {
  const retsVersion = configuration.version || DEFAULTS.RETS_VERSION;
  const userAgent = configuration.userAgent || DEFAULTS.USER_AGENT;

  const params = {
    headers: {
      'User-Agent': userAgent,
      'RETS-Version': retsVersion,
    },
    username: configuration.username,
    password: configuration.password,
    auth: configuration.auth || 'digest',
    cookies: { ...cookies },
    parse_response: false,
    // https://github.com/tomas/needle#timeout
    timeout: configuration.timeout || 300000,
    open_timeout: configuration.open_timeout || 20000,
    response_timeout: configuration.response_timeout || 300000,
    read_timeout: configuration.read_timeout || 300000
  };

  if (configuration.userAgentPassword) {
    const a1 = md5([
      userAgent,
      configuration.userAgentPassword,
    ].join(':'));
    const retsUaAuth = md5([
      a1,
      '',
      sessionId || '',
      retsVersion,
    ].join(':'));
    params.headers['RETS-UA-Authorization'] = `Digest ${retsUaAuth}`;
  }

  return params;
}
module.exports = BuildRetsRequestParams;
