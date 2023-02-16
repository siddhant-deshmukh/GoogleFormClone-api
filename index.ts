import express, { Express, Request, Response } from 'express';
import * as bodyParser  from 'body-parser'
import dotenv from 'dotenv';
import db from './queries'
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({extended:true})
);

app.get('/', (req: Request, res: Response) => {
  res.json({info :'Express + TypeScript Server'});
});
app.get('/meow', (req: Request, res: Response) => {
  res.json({info :'meow'});
});
app.get('/bhau', (req: Request, res: Response) => {
  res.json({info :'bhau'});
});
app.get('/', (req: Request, res: Response) => {
  res.json({info :'Express + TypeScript Server'});
});
app.get('/', (req: Request, res: Response) => {
  res.json({info :'Express + TypeScript Server'});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});