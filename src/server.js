const bodyParser = require('body-parser'),
      express    = require('express'),
      fs         = require('fs'),
      https      = require('https'),
      os         = require('os'),
      morgan     = require('morgan');

// server instance and middlewares
var app = express();
app.use(morgan('dev'));

// return hostname where pod is deployed
var hostname = os.hostname();

// health check for readiness
app.get('/health', (req, res) => {
  res.status(200).end();
});

// simple api handler
app.get('/apis/test.k8s.io/v1beta1', (req, res) => {
  res.status(200).end("Test API response\n");
});

// this handler will return the hostname
app.get('/apis/test.k8s.io/v1beta1/host', (req, res) => {
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
