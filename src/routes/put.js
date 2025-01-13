import express from 'express';
import { getConnection } from '../app.js';

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

putRouteur.put('/supplier/:id', async (req, res) => {
	const id = req.params.id;
	const { name, address } = req.body;
	await updateEntity('Supplier', id, { name, address }, res);
});

putRouteur.put('/category/:id', async (req, res) => {
	const id = req.params.id;
	const { name, description } = req.body;
	await updateEntity('Category', id, { name, description }, res);
});

putRouteur.put('/product/:id', async (req, res) => {
	const id = req.params.id;
	const { name, reference, description, price, id_category, stock } = req.body;
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
	await updateEntity('Client', id, { lastname, firstname, email, phone, address }, res);
});

export default putRouteur;
