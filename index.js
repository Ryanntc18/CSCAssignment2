const express = require('express');
const morgan = require('morgan');
const mainRoutes = require('./routes/mainRoutes')

const app = express();

app.set('view engine', 'ejs');

// middleware (for logging)
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


const PORT = process.env.port || 5000;

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));

// To run go to terminal and type in : npm run dev
app.get('/', (req, res) => {
    res.render('index', {title:'Home'});
});

app.get('/dashboard', (req, res) => {
    // loginStatus must be used here as there will be an error on the html if it does not exist
    res.render('dashboard', {title:'Dashboard', loginStatus: false});
});

app.get('/login', (req, res) => {
    var isValid = req.query.valid;
    res.render('login', {title:'Login', isValid});
});


// Post method to get login infomation
app.post('/login', (req, res) => {
    console.log(req.body.Username);
    console.log(req.body.Password);

    var urlLink = 'login'
    var valid = false;

    // check if name is admin
    if(req.body.Username == "admin"){
        urlLink = 'pay';
        valid = true;
    }

    res.redirect(urlLink+'/?valid=' + valid);
});

app.get('/dashboard-free', (req, res) => {
    res.redirect('./views/dashboard.ejs');
});

// main routes
app.use(mainRoutes);

//Error 404 

app.use((req, res) => {
    res.status(404).render('404error', {title:'404 Error'});
});