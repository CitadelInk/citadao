const express = require('express');
const fs = require('fs');
port = 8080;

const app = express();

app.use('/', express.static(__dirname + '/'));

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/index.html')
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});