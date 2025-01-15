import express from 'express';
import Joi from 'joi';
import { getConnection } from '../app.js';

const searchRouteur = express.Router();

const validateId = id => Joi.number().integer().positive().required().validate(id);

const validateDateRange = query => {
	const schema = Joi.object({
		start: Joi.date().required(),
		end: Joi.date().required(),
	});
	return schema.validate(query);
};

const validateThreshold = query => {
	const schema = Joi.object({
		seuil: Joi.number().integer().positive().required(),
	});
	return schema.validate(query);
};

const validateEmail = email => {
	const schema = Joi.string().email().required();
	return schema.validate(email);
};

searchRouteur.get('/commandes/date', async (req, res) => {
	const { error } = validateDateRange(req.query);
	if (error) {
		return res.status(400).json({ error: 'Paramètres start et end invalides.' });
	}

	try {
		const connection = await getConnection();
		const { start, end } = req.query;
		console.log(start, end);

		const [rows] = await connection.execute(
			`SELECT o.id,
				o.date,
				o.status,
				o.price_total,
				o.client_id,
				c.lastname,
				c.firstname
			FROM \`Order\` o
			JOIN Client c ON o.client_id = c.id
			WHERE o.date BETWEEN STR_TO_DATE(?, '%Y-%m-%d') AND STR_TO_DATE(?, '%Y-%m-%d')`,
			[start, end]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

searchRouteur.get('/client/:id/commandes', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID client invalide.' });
	}

	try {
		const connection = await getConnection();
		const clientId = req.params.id;

		const [rows] = await connection.execute(
			`SELECT o.id,
				o.date,
				o.status,
				o.price_total
			FROM \`Order\` o
			WHERE o.client_id = ?`,
			[clientId]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

searchRouteur.get('/produit/:id/commandes', async (req, res) => {
	const { error } = validateId(req.params.id);
	if (error) {
		return res.status(400).json({ error: 'ID produit invalide.' });
	}

	try {
		const connection = await getConnection();
		const productId = req.params.id;

		const [rows] = await connection.execute(
			`SELECT o.id AS order_id,
					o.date,
					o.status,
					c.lastname,
					c.firstname,
					lo.quantity,
					(lo.quantity * p.price) AS total_product_price
			FROM \`Order\` o
			JOIN Ligne_order lo ON o.id = lo.order_id
			JOIN Product p ON lo.product_id = p.id
			JOIN Client c ON o.client_id = c.id
			WHERE p.id = ?`,
			[productId]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

searchRouteur.get('/produits/stock-faible', async (req, res) => {
	const { error } = validateThreshold(req.query);
	if (error) {
		return res.status(400).json({ error: 'Le seuil doit être un nombre positif.' });
	}

	try {
		const connection = await getConnection();
		const { seuil } = req.query;

		const [rows] = await connection.execute(
			`SELECT p.id AS product_id,
					p.name,
					p.reference,
					p.stock
			FROM Product p
			WHERE p.stock <= ?`,
			[seuil]
		);
		await connection.end();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

searchRouteur.get('/client/email', async (req, res) => {
	const { email } = req.query;

	const { error } = validateEmail(email);
	if (error) {
		return res.status(400).json({ error: 'Adresse email invalide.' });
	}

	try {
		const connection = await getConnection();

		const [rows] = await connection.execute(
			`SELECT id AS client_id,
				firstname,
				lastname,
				email,
				phone
			FROM Client
			WHERE email = ?`,
			[email]
		);
		await connection.end();

		if (rows.length === 0) {
			return res.status(404).json({ error: 'Aucun client trouvé avec cet email.' });
		}

		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

searchRouteur.get('/order/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const connection = await getConnection();

		const [rows] = await connection.execute(
			`SELECT 
				o.id AS order_id,
				o.date AS order_date,
				o.status,
				o.price_total,
				lo.product_id,
				lo.quantity,
				p.name AS product_name,
				c.id AS client_id,
				c.firstname AS client_firstname,
				c.lastname AS client_lastname,
				c.email AS client_email,
				c.phone AS client_phone,
				c.address AS client_address
			FROM \`Order\` o
			LEFT JOIN Ligne_order lo ON o.id = lo.order_id
			LEFT JOIN Product p ON lo.product_id = p.id
			LEFT JOIN Client c ON o.client_id = c.id
			WHERE o.id = ?`,
			[id]
		);
		await connection.end();

		if (rows.length === 0) {
			return res.status(404).json({ error: 'Commande non trouvée' });
		}

		const order = {
			id: rows[0].order_id,
			date: rows[0].order_date,
			status: rows[0].status,
			price_total: rows[0].price_total,
			client: {
				id: rows[0].client_id,
				firstname: rows[0].client_firstname,
				lastname: rows[0].client_lastname,
				email: rows[0].client_email,
				phone: rows[0].client_phone,
				address: rows[0].client_address,
			},
			lines: rows.map(row => ({
				product_id: row.product_id,
				product_name: row.product_name,
				quantity: row.quantity,
			})),
		};

		res.json(order);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default searchRouteur;
