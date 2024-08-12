import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import askController from './controllers/askController';
import askVideoController from './controllers/askVideoController';
import dataController from './controllers/dataController';
import { __dirname } from './utils';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/ask', askController);
app.post('/ask-video', askVideoController);
app.get('/data', dataController);

export default app;
