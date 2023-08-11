const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors')

const memoryStore = new session.MemoryStore();

const realmPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvH08x0Mf7wGdIYWjV8QHc5hIuHyY3D9p9DbIXDx069+0SWiROZVcYmF14LBDQHAzjUMSdTH7VbkmsoAeDWorpE/tMDvH+UvWElkgOORz7DIWGqnYAy0HrwHTO7bGbdfCTH6MQiCllLUUB99W8VtonieOUa6llV4BGFU7EQgesc9UBHjSx2A9A5EpPfhlNBc5j/jqcAycETJfLpwtdMbSiuiwKbQ8dOGNK+Csv6BeS5LPn7s9t7n4I3EPOw8AflKuN8wN3DrEWA0BPgBN257bAhemK6Ycf/lgyPhSnceSOy4ejZ22mA1LYLwImKnq/5iXXZpvzj6SFGbDjfkroz2xPQIDAQAB' 
const kcConfig = {
  clientId: 'test-keycloak',
  bearerOnly: true,
  serverUrl: 'http://localhost:8080',
  realm: 'test-realm',
  realmPublicKey
};

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

const express = require('express');
const app = express();

app.use(cors())
app.use(keycloak.middleware());

app.get('/protected', keycloak.protect(), (req, res) => {
  res.json({
    message: "You've accessed a protected route!"
  })
});

app.listen(3333, function() {
  console.log('App listening on port 3333');
});
