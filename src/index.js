import http from 'http';
import express from 'express';
import bodyparser from 'body-parser';
import morgan from 'morgan';
import user from './routes/user';
import item from './routes/item';

let app = express();

app.use(bodyparser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
  next();
});


app.use(morgan('dev'));

app.use('/User', user());
app.use('/Item', item());

app.listen(process.env.PORT || 8080, () => {
    console.log('Listening on port 8080');
});

export default app;