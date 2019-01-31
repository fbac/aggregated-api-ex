const bodyParser = require('body-parser'),
      express    = require('express'),
      fs         = require('fs'),
      https      = require('https'),
      os         = require('os'),
      morgan     = require('morgan');

// server instance and middlewares
var app = express();
app.use(morgan('dev'));

var hostname = os.hostname();

// health check for readiness
app.get('/health', (req, res) => {
  res.status(200).end();
});

// process POST
app.post('/', (req, res) => {
  res.status(200).end();
});

// simple api
app.get('/hostname', (req, res) => {
  res.status(200).end(hostname);
});

// server
https.createServer({
  key: fs.readFileSync('/opt/app-root/src/ssl/tls.key'),
  cert: fs.readFileSync('/opt/app-root/src/ssl/tls.crt')
}, app)
.listen(8443, () => {
  console.log('API Running');
});
