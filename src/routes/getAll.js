import express from 'express';

const router = express.Router();

const getTableRoute = (tableName, getConnection) => {
	router.get(`/${tableName}`, async (req, res) => {
		try {
			const connection = await getConnection();
			const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
			await connection.end();
			res.json(rows);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	});
};

export const initializeGetAllRoutes = (app, getConnection) => {
	const tables = [
		'Supplier',
		'Category',
		'Product',
		'Supplier_product',
		'Client',
		'Order',
		'Ligne_order',
	];
	tables.forEach(table => getTableRoute(table, getConnection));
	app.use('/api', router);
};
