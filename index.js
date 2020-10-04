'use strict'

//Conexion a base de datos
var mongoose = require('mongoose');
var app = require('./app'); //Configuracion de express
var port = 3200;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio',{ useNewUrlParser:true, useUnifiedTopology: true })
    .then(() => {
        console.log("Conexion a base de datos realizada!");

        //Creacion del servidor
        app.listen(port, () => {
            console.log("Servidor corriendo correctamente en la url: http://localhost:"+port);
        });
    })
    .catch(err => {
        console.log("No se pudo conectar a base de datos: " + err);
        app.listen(port, () => {
            console.log("Solo funcion de email: http://localhost:" + port);
        });
    })

