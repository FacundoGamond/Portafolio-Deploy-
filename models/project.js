'use strict'

//Creo un modelo para cargar datos en la coleccion proyects de nuetsra base de datos
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ProyectSchema=Schema({
    name: String,
    description: String,
    category: String,
    year: Number,
    lang: String,
    image: String
});

module.exports=mongoose.model('Project', ProyectSchema); //el primer parametro es la coleccion donde se va a guardar (tiene que ir en singular, despues se pasa a plural solo)