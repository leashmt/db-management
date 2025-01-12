import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializeGetAllRoutes } from './routes/getAll.js';
import postRouter from './routes/post.js';
import deleteRouteur from './routes/delete.js';
import getRouteur from './routes/get.js';
import putRouteur from './routes/put.js';

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());

const dbConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: true,
};

export async function getConnection() {
	return await mysql.createConnection(dbConfig);
}

initializeGetAllRoutes(app, getConnection);

app.use('/api', postRouter);
app.use('/api', deleteRouteur);
app.use('/api', getRouteur);
app.use('/api', putRouteur);

app.listen(port, () => {
	console.log(`Serveur API en cours d'exécution sur http://localhost:${port}`);
});
