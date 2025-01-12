import express from 'express';
import { getConnection } from '../app.js';

const putRouteur = express.Router();

putRouteur.put('/supplier/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const { name, address } = req.body;

		if (!name && !address) {
			return res.status(400).json({ error: 'Au moins un champ doit être fourni.' });
		}

		let sql = 'UPDATE Supplier SET ';
		const params = [];

		if (name) {
			sql += 'name = ?';
			params.push(name);
		}
		if (address) {
			if (params.length > 0) sql += ', ';
			sql += 'address = ?';
			params.push(address);
		}

		sql += ' WHERE id = ?';
		params.push(id);

		await connection.execute(sql, params);
		await connection.end();

		res.json({ message: `Fournisseur avec l'ID ${id} mis à jour avec succès !` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

putRouteur.put('/category/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const { name, description } = req.body;

		if (!name && !description) {
			return res.status(400).json({ error: 'Au moins un champ doit être fourni.' });
		}

		let sql = 'UPDATE Category SET ';
		const params = [];

		if (name) {
			sql += 'name = ?';
			params.push(name);
		}
		if (description) {
			if (params.length > 0) sql += ', ';
			sql += 'description = ?';
			params.push(description);
		}

		sql += ' WHERE id = ?';
		params.push(id);

		await connection.execute(sql, params);
		await connection.end();

		res.json({ message: `Catégorie avec l'ID ${id} mise à jour avec succès !` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

putRouteur.put('/product/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const { name, reference, description, price, id_category, stock } = req.body;

		if (!name && !reference && !description && !price && !id_category && !stock) {
			return res.status(400).json({ error: 'Au moins un champ doit être fourni.' });
		}

		let sql = 'UPDATE Product SET ';
		const params = [];

		if (name) {
			sql += 'name = ?';
			params.push(name);
		}
		if (reference) {
			if (params.length > 0) sql += ', ';
			sql += 'reference = ?';
			params.push(reference);
		}
		if (description) {
			if (params.length > 0) sql += ', ';
			sql += 'description = ?';
			params.push(description);
		}
		if (price) {
			if (params.length > 0) sql += ', ';
			sql += 'price = ?';
			params.push(price);
		}
		if (id_category) {
			if (params.length > 0) sql += ', ';
			sql += 'id_category = ?';
			params.push(id_category);
		}
		if (stock) {
			if (params.length > 0) sql += ', ';
			sql += 'stock = ?';
			params.push(stock);
		}

		sql += ' WHERE id = ?';
		params.push(id);

		await connection.execute(sql, params);
		await connection.end();

		res.json({ message: `Produit avec l'ID ${id} mis à jour avec succès !` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

putRouteur.put('/client/:id', async (req, res) => {
	try {
		const connection = await getConnection();
		const id = req.params.id;
		const { lastname, firstname, email, phone, address } = req.body;

		if (!lastname && !firstname && !email && !phone && !address) {
			return res.status(400).json({ error: 'Au moins un champ doit être fourni.' });
		}

		let sql = 'UPDATE Client SET ';
		const params = [];

		if (lastname) {
			sql += 'lastname = ?';
			params.push(lastname);
		}
		if (firstname) {
			if (params.length > 0) sql += ', ';
			sql += 'firstname = ?';
			params.push(firstname);
		}
		if (email) {
			if (params.length > 0) sql += ', ';
			sql += 'email = ?';
			params.push(email);
		}
		if (phone) {
			if (params.length > 0) sql += ', ';
			sql += 'phone = ?';
			params.push(phone);
		}
		if (address) {
			if (params.length > 0) sql += ', ';
			sql += 'address = ?';
			params.push(address);
		}

		sql += ' WHERE id = ?';
		params.push(id);

		await connection.execute(sql, params);
		await connection.end();

		res.json({ message: `Client avec l'ID ${id} mis à jour avec succès !` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default putRouteur;
