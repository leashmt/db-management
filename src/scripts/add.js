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

async function addData() {
	try {
		if (!fs.existsSync('./src/scripts/add.sql')) {
			console.error("Le fichier 'add.sql' est introuvable.");
			return;
		}
		const connection = await mysql.createConnection(dbConfig);
		const schema = fs.readFileSync('./src/scripts/add.sql', 'utf8');
		await connection.query(schema);
		await connection.end();
		return true;
	} catch (error) {
		console.error("Erreur lors de l'ajout des données :", error.message);
		return false;
	}
}

addData().then(success => {
	if (success) {
		console.log('Les données ont été ajoutées avec succès.');
	} else {
		console.log("Échec de l'ajout des données.");
	}
});

export default addData;
