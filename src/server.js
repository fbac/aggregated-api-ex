const 	https = require('https'),
        express = require('express'),
        morgan = require('morgan'),
	os = require('os');

var hostname = os.hostname();
	
var app = express();
app.use(morgan('dev'));

// health check
app.get('/health', (req, res) => {
  console.log('healthz queried')
  res.status(200).end();
});

// simple api
app.get('/hostname', (req, res) => {
  console.log('hostname queried')
  response.status(200).end(hostname);
});

// server
https.createServer({
  key: fs.readFileSync('/opt/app-root/src/ssl/tls.key'),
  cert: fs.readFileSync('/opt/app-root/src/ssl/tls.crt')
}, app)
.listen(8443, () => {
  console.log('API Running');
});
