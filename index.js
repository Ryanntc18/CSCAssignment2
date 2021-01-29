const express = require('express');

const app = express();

const PORT = process.env.port || 5000;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));

// To run go to terminal and type in : npm run dev
app.get('/', (req, res) => {
    res.sendFile('./views/index.html', {root: __dirname});
});

app.get('/dashboard', (req, res) => {
    res.sendFile('./views/dashboard.html', {root: __dirname});
});

app.get('/dashboard-free', (req, res) => {
    res.redirect('./views/dashboard.html');
});

//Error 404 

app.use((req, res) => {
    res.status(404).sendFile('./views/404error.html', {root: __dirname});
});