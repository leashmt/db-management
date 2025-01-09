const { initializeDatabase } = require('./init.js');

initializeDatabase().then(success => {
	if (success) {
		console.log('La base de données a été initialisée avec succès.');
	} else {
		console.log("Échec de l'initialisation de la base de données.");
	}
});
