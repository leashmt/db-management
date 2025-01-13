import initializeDatabase from './scripts/init.js';
import { connectionLogger, errorLogger } from './scripts/logger.js';

initializeDatabase().then(success => {
	if (success) {
		console.log('La base de données a été initialisée avec succès.');
		connectionLogger.info('La base de données a été initialisée avec succès.');
	} else {
		console.log("Échec de l'initialisation de la base de données.");
		errorLogger.error("Échec de l'initialisation de la base de données.");
	}
});
