import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initializeGetRoutes } from './routes/get.js';

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

async function getConnection() {
	return await mysql.createConnection(dbConfig);
}

initializeGetRoutes(app, getConnection);

app.listen(port, () => {
	console.log(`Serveur API en cours d'exécution sur http://localhost:${port}`);
});
