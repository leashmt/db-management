import readline from 'readline';
import { getConnection } from './app.js';
import axios from 'axios';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const askQuestion = async query => {
	return new Promise(resolve => rl.question(query, resolve));
};

const main = async () => {
	console.clear();
	console.log('Démarrage du script de création de commandes.');
	const connection = await getConnection();
	try {
		const email = await askQuestion('Entrez votre email : ');
		const [user] = await connection.execute('SELECT * FROM Client WHERE email = ?', [
			email,
		]);

		let clientId;
		if (user.length === 0) {
			console.log("Utilisateur non trouvé. Ajout d'un nouvel utilisateur.");
			const lastname = await askQuestion('Entrez votre nom : ');
			const firstname = await askQuestion('Entrez votre prénom : ');
			const phone = await askQuestion('Entrez votre numéro de téléphone : ');
			const address = await askQuestion('Entrez votre adresse : ');

			try {
				const response = await axios.post('http://localhost:3000/api/client', {
					lastname,
					firstname,
					email,
					phone,
					address,
				});

				clientId = response.data.id;
				console.log("Utilisateur ajouté avec succès via l'API !");
			} catch (error) {
				console.error(
					"Erreur lors de la création de l'utilisateur :",
					error.response?.data || error.message
				);
			}
		} else {
			clientId = user[0].id;
			console.log('Utilisateur existant trouvé !');
		}

		console.log('');
		let products;

		try {
			const response = await axios.get('http://localhost:3000/api/product');
			products = response.data;
			console.log("Produits récupérés avec succès via l'API :", products);
		} catch (error) {
			console.error(
				'Erreur lors de la récupération des produits :',
				error.response?.data || error.message
			);
		}

		console.log('Liste des avions disponibles :');
		products.forEach(product =>
			console.log(`${product.id} - ${product.name} (${product.stock} en stock)`)
		);

		let orderId;

		try {
			const date = new Date().toISOString().split('T')[0];
			const response = await axios.post('http://localhost:3000/api/order', {
				client_id: clientId,
				date,
				status: 'créée',
				price_total: 0,
			});
			orderId = response.data.id;
			console.log('Commande créée avec succès :', orderId);
		} catch (error) {
			console.error(
				'Erreur lors de la création de la commande :',
				error.response?.data || error.message
			);
		}

		console.log('');
		while (true) {
			const productId = await askQuestion(
				"Entrez l'ID de l'avion à commander (ou 'x' pour terminer) : "
			);
			if (productId.toLowerCase() === 'x') break;

			const [productID] = await connection.execute(
				'SELECT * FROM Product WHERE id = ?',
				[productId]
			);
			if (productID.length === 0) {
				console.log('ID invalide. Aucun avion correspondant trouvé !');
				continue;
			}

			const quantity = parseInt(
				await askQuestion('Entrez la quantité souhaitée : '),
				10
			);

			const [product] = await connection.execute(
				'SELECT * FROM Product WHERE id = ?',
				[productId]
			);
			if (product.length === 0) {
				console.log('Produit non trouvé !');
				continue;
			}

			if (quantity > product[0].stock) {
				console.log('Quantité demandée supérieure au stock disponible !');
				continue;
			}

			const response = await axios.post('http://localhost:3000/api/ligne_order', {
				order_id: orderId,
				product_id: productId,
				quantity: quantity,
			});
			await connection.execute(
				'UPDATE Product SET stock = stock - ? WHERE id = ?',
				[quantity, productId]
			);
			console.log(`Ajouté : ${quantity} x ${product[0].name}`);
		}

		await connection.execute('UPDATE `Order` SET status = "en cours" WHERE id = ?', [
			orderId,
		]);
		console.log("Commande validée et mise en statut 'en cours'.");
	} catch (error) {
		console.error('Erreur :', error.message);
	} finally {
		await connection.end();
		rl.close();
	}
};

main();
