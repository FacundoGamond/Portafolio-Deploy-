'use strict'

//Configuro expres y el controlador
var express = require('express');
var ProjectController = require('../controllers/project');
var router = express.Router();

//Middlewares
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

//Rutas a metodos del controlador
router.get('/home', ProjectController.home);//Ruta de prubea
router.post('/test', ProjectController.test);//Ruta de prueba
router.post('/save-project', ProjectController.saveProject); //Para guardar proyectos
router.get('/project/:id?', ProjectController.getProject); //Para recibir un proyecto
router.get('/projects', ProjectController.getProjects); //Para recibir todos los proyectos
router.get('/get-image/:image', ProjectController.getImageFile)//Para recibir la imagen
router.put('/project-update/:id', ProjectController.updateProject); //Para actualizar un proyecto
router.delete('/project-delete/:id', ProjectController.deleteProject); //Para borrar un proyecto
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage); //Para subir una imagen,debemos agregar el middleware para poder utilizar el metodo req.file
router.post('/send-email', ProjectController.sendMail);//Enviar un mail para contacto
router.post('/login', ProjectController.login)//Enviar un mail para contacto
module.exports = router;