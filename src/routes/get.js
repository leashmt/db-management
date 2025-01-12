import express from 'express';
import { getConnection } from '../app.js';

const getRouteur = express.Router();

getRouteur.get('/supplier/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute(
			'SELECT * FROM Supplier WHERE id = ' + id
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/category/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute(
			'SELECT * FROM Category WHERE id = ' + id
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/product/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM Product WHERE id = ' + id);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/client/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM Client WHERE id = ' + id);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/order/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM `Order` WHERE id = ' + id);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/ligne_order', async (req, res) => {
	try {
		const connection = await getConnection();
		const { order_id, product_id } = req.query;
		const [rows] = await connection.execute(
			'SELECT * FROM Ligne_order WHERE order_id = ' +
				order_id +
				' AND product_id = ' +
				product_id
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default getRouteur;
