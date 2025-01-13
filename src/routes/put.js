import express from 'express';
import { getConnection } from '../app.js';
import Joi from 'joi';

const putRouteur = express.Router();

const updateEntity = async (table, id, fields, res) => {
	try {
		const connection = await getConnection();
		if (!fields || Object.keys(fields).length === 0) {
			return res.status(400).json({ error: 'Au moins un champ doit être fourni.' });
		}

		const columns = Object.keys(fields);
		const values = Object.values(fields);

		let sql = `UPDATE ${table} SET `;
		sql += columns.map(col => `${col} = ?`).join(', ');
		sql += ' WHERE id = ?';

		values.push(id);

		await connection.execute(sql, values);
		await connection.end();

		res.json({ message: `${table} avec l'ID ${id} mis à jour avec succès !` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const supplierSchema = Joi.object({
	name: Joi.string().max(255),
	address: Joi.string().max(255),
});

const categorySchema = Joi.object({
	name: Joi.string().max(255),
	description: Joi.string().max(500),
});

const productSchema = Joi.object({
	name: Joi.string().max(255),
	reference: Joi.string().max(255),
	description: Joi.string().max(500),
	price: Joi.number().positive(),
	id_category: Joi.number().integer(),
	stock: Joi.number().integer().min(0),
});

const clientSchema = Joi.object({
	lastname: Joi.string().max(255),
	firstname: Joi.string().max(255),
	email: Joi.string().email(),
	phone: Joi.string().max(20),
	address: Joi.string().max(255),
});

putRouteur.put('/supplier/:id', async (req, res) => {
	const id = req.params.id;
	const { name, address } = req.body;

	const { error } = supplierSchema.validate({ name, address });
	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}

	await updateEntity('Supplier', id, { name, address }, res);
});

putRouteur.put('/category/:id', async (req, res) => {
	const id = req.params.id;
	const { name, description } = req.body;

	const { error } = categorySchema.validate({ name, description });
	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}

	await updateEntity('Category', id, { name, description }, res);
});

putRouteur.put('/product/:id', async (req, res) => {
	const id = req.params.id;
	const { name, reference, description, price, id_category, stock } = req.body;

	const { error } = productSchema.validate({
		name,
		reference,
		description,
		price,
		id_category,
		stock,
	});
	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}

	await updateEntity(
		'Product',
		id,
		{ name, reference, description, price, id_category, stock },
		res
	);
});

putRouteur.put('/client/:id', async (req, res) => {
	const id = req.params.id;
	const { lastname, firstname, email, phone, address } = req.body;

	const { error } = clientSchema.validate({
		lastname,
		firstname,
		email,
		phone,
		address,
	});
	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}

	await updateEntity('Client', id, { lastname, firstname, email, phone, address }, res);
});

export default putRouteur;
