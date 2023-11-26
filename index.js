import { auth } from 'express-openid-connect';
import express from 'express';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env[`sessionSecret`],
  baseURL: 'https://<WEB_APPLICATION_HOSTNAME_AND_DOMAIN>',
  clientID: process.env[`clientId`],
  clientSecret: process.env[`clientSecret`],
  issuerBaseURL: process.env[`idpUri`],
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
  attemptSilentLogin: true,
};

// This example uses express.js to provide the proxy services between the
// frontend web application and Qlik Cloud REST endpoints and websocket
// connections to the engine.
const app = express();
app.use(express.static("public"));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  if(req.oidc.isAuthenticated()) {
    res.sendFile(join(__dirname, 'index.html'))
    return
  }
  res.oidc.login({ returnTo: '/' })
});

app.get('/oauth-callback', (req, res) => {
  res.sendFile('/public/oauth-callback.html')
})

const server = app.listen(3000, () => {
  console.log('Backend started');
})