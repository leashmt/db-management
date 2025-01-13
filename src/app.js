import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initializeGetAllRoutes } from './routes/getAll.js';
import postRouter from './routes/post.js';
import deleteRouteur from './routes/delete.js';
import getRouteur from './routes/get.js';
import putRouteur from './routes/put.js';
import complexRouteur from './routes/complexRoutes.js';
import { connectionLogger, errorLogger, logger } from './scripts/logger.js';
logger.info('Démarrage du serveur');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: {
		error: 'Trop de requêtes. Réessayez dans 15 minutes.',
	},
});
app.use(limiter);

app.use((req, res, next) => {
	logger.info(
		`[${req.method}] ${req.originalUrl} - Body: ${JSON.stringify(
			req.body
		)} - Query: ${JSON.stringify(req.query)}`
	);
	next();
});

const dbConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: true,
};

export async function getConnection() {
	try {
		const connection = await mysql.createConnection(dbConfig);
		connectionLogger.info('Connexion à la base de données réussie.');
		return connection;
	} catch (error) {
		errorLogger.error(`Erreur de connexion à la base de données : ${error.message}`);
		throw error;
	}
}

initializeGetAllRoutes(app, getConnection);

app.use('/api', postRouter);
app.use('/api', deleteRouteur);
app.use('/api', getRouteur);
app.use('/api', putRouteur);
app.use('/api/complex', complexRouteur);

app.use((req, res, next) => {
	const errorMessage = `Route non trouvée : [${req.method}] ${req.originalUrl}`;
	errorLogger.error(errorMessage);
	res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
	errorLogger.error(
		`Error on route [${req.method}] ${req.originalUrl}: ${err.message}`
	);
	res.status(500).send("Une erreur inattendue s'est produite.");
});

app.listen(port, () => {
	logger.info(`Serveur API en cours d'exécution sur http://localhost:${port}`);
});
