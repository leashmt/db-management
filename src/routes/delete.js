import express from 'express';
import { getConnection } from '../app.js';

const deleteRouteur = express.Router();

deleteRouteur.delete('/supplier/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [result] = await connection.execute(
			'DELETE FROM Supplier WHERE id = ' + id
		);
		await connection.end();
		res.status(200).json({ message: 'Fournisseur supprimé avec succès !' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

deleteRouteur.delete('/category/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [result] = await connection.execute(
			'DELETE FROM Category WHERE id = ' + id
		);
		await connection.end();
		res.status(200).json({ message: 'Catégorie supprimée avec succès !' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

deleteRouteur.delete('/product/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [result] = await connection.execute('DELETE FROM Product WHERE id = ' + id);
		await connection.end();
		res.status(200).json({ message: 'Produit supprimé avec succès !' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

deleteRouteur.delete('/supplier_product', async (req, res) => {
	try {
		const connection = await getConnection();
		const { supplier_id, product_id } = req.query;
		const [result] = await connection.execute(
			'DELETE FROM Supplier_product WHERE supplier_id = ' +
				supplier_id +
				' AND product_id = ' +
				product_id
		);
		await connection.end();
		res.status(200).json({
			message: 'Lien fournisseur-produit supprimé avec succès !',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

deleteRouteur.delete('/client/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [result] = await connection.execute('DELETE FROM Client WHERE id = ' + id);
		await connection.end();
		res.status(200).json({ message: 'Client supprimé avec succès !' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

deleteRouteur.delete('/order/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [result] = await connection.execute('DELETE FROM `Order` WHERE id = ' + id);
		await connection.end();
		res.status(200).json({ message: 'Commande supprimée avec succès !' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

deleteRouteur.delete('/ligne_order', async (req, res) => {
	try {
		const connection = await getConnection();
		const { order_id, product_id } = req.query;
		const [result] = await connection.execute(
			'DELETE FROM Ligne_order WHERE order_id = ' +
				order_id +
				' AND product_id = ' +
				product_id
		);
		await connection.end();
		res.status(200).json({ message: 'Ligne de commande supprimée avec succès !' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default deleteRouteur;
