const argon2 = require('argon2');
const connection = require('../sql/connection');
const JWT = require('jsonwebtoken');

const register = async (req, res) => {
	let sql = `INSERT INTO users (username,email,pw_hash) VALUES (?,?,?)`;
	let { username, email, password } = req.body;

	let hash;
	try {
		hash = await argon2.hash(password);
	} catch (err) {
		console.log(err, 'hash');
		res.status(500).json({ message: `Error creating the user`, err });
	}

	const body = [username, email, hash];
	connection.query(sql, body, (err, results) => {
		if (err) {
			return res.status(500).json({ message: `Error creating the user`, err });
		}
		console.log(results);

		let token = JWT.sign(
			{
				username: username,
				user_id: results.insertId,
			},
			process.env.JWT_SECRET
		);
		console.log(token);

		return res
			.status(200)
			.json({ message: `User created successfully`, results, token });
	});
};

const login = async (req, res) => {
	let sql = `SELECT * FROM users WHERE email = ?`;
	let { email, password } = req.body;
	connection.query(sql, [email], async (err, rows) => {
		if (err) {
			return res.status(500).json({ message: `Could not get user`, err });
		}
		if (rows.length > 1) {
			console.log('Return too many results fo email address');
			return res
				.status(500)
				.json({ message: `Return too many rows for email address` });
		}
		if (rows.length === 0) {
			console.log('Email does not exist');
			return res.status(400).json({
				message: `The email does not exist.  Please sign up for an account or try again.`,
			});
		}
		console.log(rows);
		const hashPassword = rows[0].pw_hash;
		let match;
		try {
			match = await argon2.verify(hashPassword, password);
			console.log(match);
		} catch (err) {
			console.log(err);
			return res
				.status(500)
				.json({ message: 'Something went wrong logging in', err });
		}
		if (!match) {
			return res.status(400).json({ message: 'Passwords do not match' });
		}

		let token = JWT.sign(
			{
				username: rows[0].username,
				email: rows[0].email,
				user_id: rows[0].id,
			},
			process.env.JWT_SECRET
		);
		console.log(token);
		return res.status(200).json({
			token,
			message: `Successful Login`,
		});
	});
};

module.exports = { register, login };
