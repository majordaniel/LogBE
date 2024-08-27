const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const helmet = require('helmet');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const http = require('http').Server(app);
const socketIo = require('./socket');
const routes = require('./routes');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, __dirname + '/images');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname); //Appending extension
    },
  });

const upload = multer({ storage: storage });

app.use(cors({
  origin : '*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.fields([{ name: 'image' }]));
app.use(helmet());

Sentry.init({

  dsn: process.env.SENTRY_DSN,

  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),

    // enable Express.js middleware tracing

    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 0.1,

});

app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request

app.use(Sentry.Handlers.tracingHandler());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Izigo Api!' });
});

app.use('/api/v1', routes)
app.all('*', (req, res) =>
  res.status(404).json({
    status: 404,
    message: 'The page you are looking for does not exist',
  }),
);


const io = socketIo.startIo(http);
app.set('socketIo', io);

http.listen(port, () => {
    console.log(`app is live at http://127.0.0.1:${port}`);
});