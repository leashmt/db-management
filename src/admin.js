import readline from 'readline';
import axios from 'axios';
// import { getConnection } from './app';
// const connection = await getConnection();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const askQuestion = async query => {
	return new Promise(resolve => rl.question(query, resolve));
};

const listActions = () => {
	console.log('Liste des actions disponibles :');
	console.log('1. Chercher les commandes par date');
	console.log("2. Chercher les commandes d'un client");
	console.log('3. Chercher une commande par id');
	console.log('4. Chercher les commandes liées à un produit');
	console.log('5. Chercher les stocks faibles');
};

const main = async () => {
	console.clear();
	console.log("Démarrage du script de l'administration.");
	while (true) {
		console.log('');
		listActions();
		const action = await askQuestion('Entrez une action (ou "0" pour quitter) : ');

		if (action === '0') break;

		switch (action) {
			case '1':
				const dateStart = await askQuestion(
					'Entrez la date de début yyyy-mm-dd (ou "0" pour quitter) : '
				);
				if (dateStart === '0') break;
				const dateEnd = await askQuestion(
					'Entrez la date de fin yyyy-mm-dd (ou "0" pour quitter) : '
				);
				if (dateEnd === '0') break;
				try {
					const response = await axios.get(
						`http://localhost:3000/api/search/commandes/date?start=${dateStart}&end=${dateEnd}`
					);
					console.log(response.data);
				} catch (error) {
					console.error(
						'Erreur lors de la recherche des commandes :',
						error.response?.data || error.message || error
					);
				}
				break;
			case '2':
				const clientId = await askQuestion(
					'Entrez l\'ID du client (ou "0" pour quitter) : '
				);
				if (clientId === '0') break;
				try {
					const response = await axios.get(
						`http://localhost:3000/api/search/client/${clientId}/commandes`
					);
					console.log(response.data);
				} catch (error) {
					console.error(
						'Erreur lors de la recherche des commandes :',
						error.response?.data || error.message
					);
				}
				break;
			case '3':
				const orderId = await askQuestion(
					'Entrez l\'ID de la commande (ou "0" pour quitter) : '
				);
				if (orderId === '0') break;
				try {
					const response = await axios.get(
						`http://localhost:3000/api/search/order/${orderId}`
					);
					console.log(response.data);
				} catch (error) {
					console.error(
						'Erreur lors de la recherche des commandes :',
						error.response?.data || error.message
					);
				}
				break;
			case '4':
				const productId = await askQuestion(
					'Entrez l\'ID du produit (ou "0" pour quitter) : '
				);
				if (productId === '0') break;
				try {
					const response = await axios.get(
						`http://localhost:3000/api/search/produit/${productId}/commandes`
					);
					console.log(response.data);
				} catch (error) {
					console.error(
						'Erreur lors de la recherche des commandes :',
						error.response?.data || error.message
					);
				}
				break;
			case '5':
				const stock = await askQuestion(
					'Entrez le stock minimum (ou "x" pour quitter) : '
				);
				if (stock === 'x') break;
				try {
					const response = await axios.get(
						`http://localhost:3000/api/search/produits/stock-faible?seuil=${stock}`
					);
					console.log(response.data);
				} catch (error) {
					console.error(
						'Erreur lors de la recherche des commandes :',
						error.response?.data || error.message
					);
				}
				break;
			default:
				console.log('Action non trouvée.');
				break;
		}
	}
};

main();
