import express from 'express';
import Joi from 'joi';
import { getConnection } from '../app.js';

const complexRouteur = express.Router();

const validateId = id => {
	const schema = Joi.number().integer().positive().required();
	return schema.validate(id);
};

complexRouteur.get('/order/:id', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const orderId = req.params.id;

		const [rows] = await connection.execute(
			`SELECT o.id AS order_id,
			               o.date AS order_date,
			               o.status AS order_status,
			               p.name AS product_name,
			               p.reference AS product_reference,
			               p.price AS product_price,
			               lo.quantity AS product_quantity,
			               (p.price * lo.quantity) AS total_price
			FROM \`Order\` o
			JOIN Ligne_order lo ON o.id = lo.order_id
			JOIN Product p ON lo.product_id = p.id
			WHERE o.id = ?`,
			[orderId]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

complexRouteur.get('/order/:id/product', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const orderId = req.params.id;

		const [rows] = await connection.execute(
			`SELECT p.name AS product_name,
			               p.reference AS product_reference,
			               p.price AS product_price,
			               lo.quantity AS product_quantity
			FROM \`Order\` o
			JOIN Ligne_order lo ON o.id = lo.order_id
			JOIN Product p ON lo.product_id = p.id
			WHERE o.id = ?`,
			[orderId]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

complexRouteur.get('/client/:id/orders', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID invalide' });
	}

	try {
		const connection = await getConnection();
		const clientId = req.params.id;

		const [rows] = await connection.execute(
			`SELECT o.id AS order_id,
			               o.date AS order_date,
			               o.status AS order_status,
			               o.price_total AS order_total_price,
			               c.lastname AS client_lastname,
			               c.firstname AS client_firstname
			FROM \`Order\` o
			JOIN Client c ON o.client_id = c.id
			WHERE c.id = ?`,
			[clientId]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

export default complexRouteur;
