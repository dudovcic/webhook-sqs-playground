const express = require('express');
const app = express();
const port = 3003;

app.post('/callback', (req, res) => {
    res.writeHead(200, res.headers);
    console.log('logging..', req.body);
    return res.end('success')
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));