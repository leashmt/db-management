import express from 'express';
import { getConnection } from '../app.js';

const postRouter = express.Router();

postRouter.post('/supplier', async (req, res) => {
	try {
		const connection = await getConnection();
		const { name, address } = req.body;
		const [result] = await connection.execute(
			'INSERT INTO Supplier (name, address) VALUES (?, ?)',
			[name, address]
		);
		await connection.end();
		res.status(201).json({
			id: result.insertId,
			message: 'Fournisseur ajouté avec succès !',
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

postRouter.post('/category', async (req, res) => {
	try {
		const connection = await getConnection();
		const { name, description } = req.body;
		const [result] = await connection.execute(
			'INSERT INTO Category (name, description) VALUES (?, ?)',
			[name, description]
		);
		await connection.end();
		res.status(201).json({
			id: result.insertId,
			message: 'Catégorie ajoutée avec succès !',
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

postRouter.post('/product', async (req, res) => {
	try {
		const connection = await getConnection();
		const { name, reference, description, price, id_category, stock } = req.body;
		const [result] = await connection.execute(
			'INSERT INTO Product (name, reference, description, price, id_category, stock) VALUES (?, ?, ?, ?, ?, ?)',
			[name, reference, description, price, id_category, stock]
		);
		await connection.end();
		res.status(201).json({
			id: result.insertId,
			message: 'Produit ajouté avec succès !',
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

postRouter.post('/supplier_product', async (req, res) => {
	try {
		const connection = await getConnection();
		const { supplier_id, product_id } = req.body;
		await connection.execute(
			'INSERT INTO Supplier_product (supplier_id, product_id) VALUES (?, ?)',
			[supplier_id, product_id]
		);
		await connection.end();
		res.status(201).json({
			message: 'Relation fournisseur-produit ajoutée avec succès !',
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

postRouter.post('/client', async (req, res) => {
	try {
		const connection = await getConnection();
		const { lastname, firstname, email, phone, address } = req.body;
		const [result] = await connection.execute(
			'INSERT INTO Client (lastname, firstname, email, phone, address) VALUES (?, ?, ?, ?, ?)',
			[lastname, firstname, email, phone, address]
		);
		await connection.end();
		res.status(201).json({
			id: result.insertId,
			message: 'Client ajouté avec succès !',
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

postRouter.post('/order', async (req, res) => {
	try {
		const connection = await getConnection();
		const { client_id, date, status, price_total } = req.body;
		const [result] = await connection.execute(
			'INSERT INTO `Order` (client_id, date, status, price_total) VALUES (?, ?, ?, ?)',
			[client_id, date, status, price_total]
		);
		await connection.end();
		res.status(201).json({
			id: result.insertId,
			message: 'Commande ajoutée avec succès !',
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

postRouter.post('/ligne_order', async (req, res) => {
	try {
		const connection = await getConnection();
		const { order_id, product_id, quantity } = req.body;
		await connection.execute(
			'INSERT INTO Ligne_order (order_id, product_id, quantity) VALUES (?, ?, ?)',
			[order_id, product_id, quantity]
		);
		await connection.end();
		res.status(201).json({
			message: 'Ligne de commande ajoutée avec succès !',
		});
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

export default postRouter;
