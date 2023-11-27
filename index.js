const __dirname = new URL('.', import.meta.url).pathname;
import { auth } from 'express-openid-connect';
import express from 'express';
import { join } from 'path';
import { config } from './config.js';



const Auth0config = {
  authRequired: false,
  auth0Logout: true,
  secret: config.sessionSecret,
  baseURL: `https://${config.HOST}`,
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  issuerBaseURL: `https://${config.idpUri}`,
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
app.use(auth(Auth0config));

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

const server = app.listen(process.env.PORT, () => {
  console.log('Backend started');
})