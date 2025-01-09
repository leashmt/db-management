import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: true,
};

async function initializeDatabase() {
	try {
		if (!fs.existsSync('./src/scripts/init.sql')) {
			console.error("Le fichier 'init.sql' est introuvable.");
			return;
		}

		const connection = await mysql.createConnection(dbConfig);
		const schema = fs.readFileSync('./src/scripts/init.sql', 'utf8');

		await connection.query(schema);
		await connection.end();
		return true;
	} catch (error) {
		console.error("Erreur lors de l'initialisation de la base :", error.message);
		return false;
	}
}

export default initializeDatabase;
