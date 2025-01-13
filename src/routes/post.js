import express from 'express';
import Joi from 'joi';
import { getConnection } from '../app.js';

const postRouter = express.Router();

const supplierSchema = Joi.object({
	name: Joi.string().required(),
	address: Joi.string().required(),
});

const categorySchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().optional(),
});

const productSchema = Joi.object({
	name: Joi.string().required(),
	reference: Joi.string().required(),
	description: Joi.string().optional(),
	price: Joi.number().positive().required(),
	id_category: Joi.number().integer().required(),
	stock: Joi.number().integer().min(0).required(),
});

const supplierProductSchema = Joi.object({
	supplier_id: Joi.number().integer().required(),
	product_id: Joi.number().integer().required(),
});

const clientSchema = Joi.object({
	lastname: Joi.string().required(),
	firstname: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string().optional(),
	address: Joi.string().optional(),
});

const orderSchema = Joi.object({
	client_id: Joi.number().integer().required(),
	date: Joi.date().required(),
	status: Joi.string().required(),
	price_total: Joi.number().positive().required(),
});

const ligneOrderSchema = Joi.object({
	order_id: Joi.number().integer().required(),
	product_id: Joi.number().integer().required(),
	quantity: Joi.number().integer().min(1).required(),
});

const validateData = schema => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}
		next();
	};
};

postRouter.post('/supplier', validateData(supplierSchema), async (req, res) => {
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

postRouter.post('/category', validateData(categorySchema), async (req, res) => {
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

postRouter.post('/product', validateData(productSchema), async (req, res) => {
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

postRouter.post(
	'/supplier_product',
	validateData(supplierProductSchema),
	async (req, res) => {
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
	}
);

postRouter.post('/client', validateData(clientSchema), async (req, res) => {
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

postRouter.post('/order', validateData(orderSchema), async (req, res) => {
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

postRouter.post('/ligne_order', validateData(ligneOrderSchema), async (req, res) => {
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
