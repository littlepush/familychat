import 'dotenv/config';
import bodyParser from "body-parser";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', express.static('./frontend'))

const port = process.env.PORT || 8091;
const server = app.listen(port, () => {
  console.log(`listening on ${port}`);
});

export default app;
