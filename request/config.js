import config from 'next/config';
const {serverBaseUrl,clientId,clientSecret,basicAuthorization} = config().publicRuntimeConfig;

let exports = {
    serviceRootPath: serverBaseUrl,
    clientId:clientId,
    clientSecret:clientSecret,
    basicAuthorization:basicAuthorization
};
export default exports;
