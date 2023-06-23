const JWT = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	let header = req.get('Authorization');
	let signedToken;
	if (header) {
		signedToken = header.split(' ')[1];
	}
	if (signedToken) {
		try {
			let token = JWT.verify(signedToken, process.env.JWT_SECRET);
			console.log(token, 'decoded token');
			req.user_token = token;
			next();
		} catch (err) {
			console.log(err);
		}
	} else {
		res.status(400).json({ message: 'you are not authorized' });
	}
};

module.exports = verifyJWT;
