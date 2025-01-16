import { getConnection } from './app.js';

const connection = await getConnection();

try {
	// Récupérer le nombre total de clients, produits, commandes, et fournisseurs
	const [totals] = await connection.execute(`
		SELECT 
			(SELECT COUNT(*) FROM Client) AS total_clients,
			(SELECT COUNT(*) FROM Product) AS total_products,
			(SELECT COUNT(*) FROM \`Order\`) AS total_orders,
			(SELECT COUNT(*) FROM Supplier) AS total_suppliers
	`);

	// Récupérer les cinq clients avec le plus de commandes
	const [topClients] = await connection.execute(`
		SELECT 
			c.id AS client_id,
			c.firstname,
			c.lastname,
			c.email,
			COUNT(o.id) AS total_orders
		FROM Client c
		LEFT JOIN \`Order\` o ON c.id = o.client_id
		GROUP BY c.id
		ORDER BY total_orders DESC
		LIMIT 5
	`);

	// Récupérer les produits les plus vendus
	const [topProducts] = await connection.execute(`
		SELECT 
			p.id AS product_id,
			p.name AS product_name,
			SUM(lo.quantity) AS total_sold
		FROM Product p
		LEFT JOIN Ligne_order lo ON p.id = lo.product_id
		GROUP BY p.id
		ORDER BY total_sold DESC
		LIMIT 5
	`);

	// Récupérer les clients ayant dépensé le plus
	const [topSpendingClients] = await connection.execute(`
		SELECT 
			c.id AS client_id,
			c.firstname,
			c.lastname,
			SUM(o.price_total) AS total_spent
		FROM Client c
		LEFT JOIN \`Order\` o ON c.id = o.client_id
		GROUP BY c.id
		ORDER BY total_spent DESC
		LIMIT 5
	`);

	// Récupérer la répartition des statuts des commandes
	const [orderStatuses] = await connection.execute(`
		SELECT 
			status,
			COUNT(*) AS count,
			ROUND((COUNT(*) * 100 / (SELECT COUNT(*) FROM \`Order\`)), 2) AS percentage
		FROM \`Order\`
		GROUP BY status
	`);

	// Récupérer la valeur moyenne des commandes
	const [averageOrderValue] = await connection.execute(`
		SELECT 
			ROUND(AVG(price_total), 2) AS average_order_value
		FROM \`Order\`
	`);

	// Récupérer les produits non vendus
	const [unsoldProducts] = await connection.execute(`
		SELECT 
			p.id AS product_id,
			p.name AS product_name,
            p.price AS product_price
		FROM Product p
		LEFT JOIN Ligne_order lo ON p.id = lo.product_id
		WHERE lo.product_id IS NULL
	`);

	// Récupérer les statistiques globales des clients
	const [clientStats] = await connection.execute(`
		SELECT 
			(SELECT COUNT(*) FROM Client) AS total_clients,
			(SELECT COUNT(DISTINCT client_id) FROM \`Order\`) AS active_clients,
			(SELECT COUNT(*) FROM Client) - (SELECT COUNT(DISTINCT client_id) FROM \`Order\`) AS inactive_clients
	`);

	// Récupérer le nombre de commandes par mois
	const [ordersPerMonth] = await connection.execute(`
		SELECT 
			DATE_FORMAT(date, '%Y-%m') AS month,
			COUNT(*) AS total_orders
		FROM \`Order\`
		GROUP BY month
		ORDER BY month DESC
	`);

	// Récupérer les 5 produits avec le plus de stock
	const [topStockProducts] = await connection.execute(`
		SELECT 
			id AS product_id,
			name AS product_name,
			stock
		FROM Product
		ORDER BY stock DESC
		LIMIT 5
	`);

	// Récupérer les 5 produits ayant généré le plus de revenus
	const [topRevenueProducts] = await connection.execute(`
		SELECT 
			p.id AS product_id,
			p.name AS product_name,
			SUM(lo.quantity * p.price) AS total_revenue
		FROM Product p
		LEFT JOIN Ligne_order lo ON p.id = lo.product_id
		GROUP BY p.id
		ORDER BY total_revenue DESC
		LIMIT 5
	`);

	// Récupérer le fournisseur avec le plus de produits
	const [topSupplier] = await connection.execute(`
        SELECT 
            s.id AS supplier_id,
            s.name AS supplier_name,
            COUNT(sp.product_id) AS total_products
        FROM Supplier s
        LEFT JOIN Supplier_product sp ON s.id = sp.supplier_id
        GROUP BY s.id
        ORDER BY total_products DESC
        LIMIT 1
    `);

	// Récupérer le revenu total
	const [totalRevenue] = await connection.execute(`
		SELECT 
			SUM(price_total) AS total_revenu
		FROM \`Order\`
	`);

	console.clear();
	console.log('');
	console.log('--- Statistiques générales ---');
	console.log('');
	console.log('Revenu total :', totalRevenue[0].total_revenue, '€');
	console.log('');
	console.log('Totaux :');
	console.table(totals[0]);
	console.log('');

	console.log('');
	console.log('--- Statistiques clients ---');
	console.log('');
	console.log('Top 5 clients :');
	console.table(topClients);
	console.log('');
	console.log('Clients ayant dépensé le plus :');
	console.table(topSpendingClients);
	console.log('');
	console.log('Statistiques clients :');
	console.table(clientStats[0]);
	console.log('');

	console.log('');
	console.log('--- Statistiques produits ---');
	console.log('');
	console.log('Produits les plus vendus :');
	console.table(topProducts);
	console.log('');
	console.log('Produits non vendus :');
	console.table(unsoldProducts);
	console.log('');
	console.log('Top 5 produits avec le plus de stock :');
	console.table(topStockProducts);
	console.log('');
	console.log('Top 5 produits ayant généré le plus de revenus :');
	console.table(topRevenueProducts);
	console.log('');

	console.log('');
	console.log('--- Statistiques commandes ---');
	console.log('');
	console.log(
		'Valeur moyenne des commandes :',
		averageOrderValue[0].average_order_value,
		'€'
	);
	console.log('');
	console.log('Répartition des statuts des commandes :');
	console.table(orderStatuses);
	console.log('');
	console.log('Commandes par mois :');
	console.table(ordersPerMonth);
	console.log('');

	console.log('');
	console.log('--- Fournisseur ---');
	console.log('');
	console.log('Fournisseur avec le plus de produits :');
	console.table([
		{
			supplier_id: topSupplier[0].supplier_id,
			supplier_name: topSupplier[0].supplier_name,
			total_products: topSupplier[0].total_products,
		},
	]);
	console.log('');
} catch (error) {
	console.error("Erreur lors de l'exécution des requêtes :", error.message);
} finally {
	await connection.end();
}
