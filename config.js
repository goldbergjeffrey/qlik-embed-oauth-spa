import * as dotenv from 'dotenv';
import * as path from 'path';

const __dirname = new URL('.', import.meta.url).pathname;

// Support for replit secrets
if(process.env.REPL_SLUG)
{
  process.env.HOST = `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  process.env.NODE_ENV = 'replit';
}
else
{
  dotenv.config({
    path: path.resolve(__dirname, `env/${process.env.NODE_ENV}.env`)
  });
}

const config = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  clientId: process.env.clientId || 'clientId',
  clientSecret: process.env.clientSecret || 'clientSecret',
  idpUri: process.env.idpUri || 'idpUri',
  sessionSecret: process.env.sessionSecret || 'sessionSecret',
  tenantUri: process.env.tenantUri || 'tenantUri',
  redirectPage: process.env.redirectPage || 'redirectPage',
}

export { config };