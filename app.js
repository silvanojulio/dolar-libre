const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
var path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Precio = require('./precio');
const Configuracion = require('./configuracion');

const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://dollarnow:dollarnow2019@ds015740.mlab.com:15740/dolarnow';

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//For public folder
app.use(express.static(path.join(__dirname, 'public')));

router.get('/precios', (req, res) => {
    
   Precio.findOne((err, data) => {
    if (err) 
        return res.json({ success: false, error: err });

    return res.json({ success: true, data: data });
  });
  
});

router.post('/setPrecios', (req, res) => {
    
    Configuracion.findOne((err, configuracion) => {
        
        if (err) 
            return res.json({ success: false, error: err });

        if(!configuracion.sitioActivo)
            return res.json({ success: false, error: {message: 'El sitio no está activo'} });

        if(configuracion.password!==req.body.password)
            return res.json({ success: false, error: {message: 'Acceso restringido'} });
    
        return Precio.findOneAndUpdate({}, 
            {
                precioCompra:  req.body.precioCompra, 
                precioVenta: req.body.precioVenta
            }, {}, (err) => {
    
                if (err) 
                    return res.json({ success: false, error: err2 });
    
                return res.json({success: true});
            });
      });

});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
//app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

module.exports = app;

