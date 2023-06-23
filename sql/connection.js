const mysql = require('mysql');

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

connection.connect();

connection.query('select now()', (err, results) => {
	if (err) {
		console.log('Could not test the database connection', err);
	} else {
		console.log('Connection test results', results);
	}
});

module.exports = connection;
