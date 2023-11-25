import { auth } from 'express-openid-connect';
import express from 'express';
import { join } from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env[`sessionSecret`],
  baseURL: 'https://qlik-embed-oauth-spa.qlik.repl.co',
  clientID: process.env[`clientId`],
  clientSecret: process.env[`clientSecret`],
  issuerBaseURL: process.env[`idpUri`],
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
  attemptSilentLogin: true,
};

// This example uses express-session and redis to manage and 
// store sessions for this proxy. In this example, redis stores
// the ID token from the identity provider and the Qlik Cloud
// session cookie used when proxying requests from this web
// application to Qlik Cloud.
// const sessionSecret = process.env['sessionSecret'];
// const redis_db = process.env['redis_db'];
// const redis_port = Number(process.env['redis_port']);
// const redis_pwd = process.env['redis_pwd'];

// // Create the connection to Redis. This example uses Redis cloud free tier.
// const client = createClient({
//   password: redis_pwd,
//   socket: {
//     host: redis_db,
//     port: redis_port
//   }
// });

// await client.connect();
// const store = new RedisStore({ client: client });

// This example uses express.js to provide the proxy services between the
// frontend web application and Qlik Cloud REST endpoints and websocket
// connections to the engine.
const app = express();
app.use(express.static("public"));
// Add the session management component to the proxy. Adds a 1st-party cookie
// to manage a user's session.
// app.use(session({
//   store: store,
//   secret: sessionSecret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     sameSite: true,
//     secure: false,
//     httpOnly: false,
//     maxAge: 1000 * 60 * 10 // 10 minutes
//   }
// }));

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