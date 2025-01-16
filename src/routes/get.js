import express from 'express';
import Joi from 'joi';
import { getConnection } from '../app.js';

const getRouteur = express.Router();

const validateId = id => {
	const schema = Joi.number().integer().positive().required();
	return schema.validate(id);
};

getRouteur.get('/supplier/:id', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM Supplier WHERE id = ?', [
			id,
		]);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/category/:id', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM Category WHERE id = ?', [
			id,
		]);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/product/:id', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM Product WHERE id = ?', [
			id,
		]);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/client/:id', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM Client WHERE id = ?', [
			id,
		]);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/order/:id', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const id = req.params.id;
		const [rows] = await connection.execute('SELECT * FROM `Order` WHERE id = ?', [
			id,
		]);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

getRouteur.get('/ligne_order', async (req, res) => {
	const schema = Joi.object({
		order_id: Joi.number().integer().positive().required(),
		product_id: Joi.number().integer().positive().required(),
	});
	const { error } = schema.validate(req.query);
	if (error) {
		return res.status(400).json({ error: 'Paramètres invalides' });
	}

	try {
		const connection = await getConnection();
		const { order_id, product_id } = req.query;
		const [rows] = await connection.execute(
			'SELECT * FROM Ligne_order WHERE order_id = ? AND product_id = ?',
			[order_id, product_id]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default getRouteur;
