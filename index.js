const express = require('express');

const app = express();

// To run go to terminal and type in : npm run dev
app.get('/', (req, res) => {res.send('<h1>Hello World!</h1>')});

const PORT = process.env.port || 5000;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));

