import http from 'http';
import express from 'express';
import bodyparser from 'body-parser';
import morgan from 'morgan';
import user from './routes/user';
import item from './routes/item';

let app = express();

app.use(bodyparser.json());

app.use(morgan('dev'));

app.use('/User', user());
app.use('/Item', item());

app.listen(process.env.PORT || 8080, () => {
    console.log('Listening on port 8080');
});

export default app;