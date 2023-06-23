require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');

const PORT = 4004;
const app = express();

app.use(cors());
app.use(express.json());
app.use(authRouter);

app.get('/', (req, res) => {
	res.json('Welcome to my server!');
});

app.listen(PORT, () => {
	console.log('Server Running on port', PORT);
});
