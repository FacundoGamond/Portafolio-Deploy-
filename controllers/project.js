'use strict'
var Project = require('../models/project'); //Importo el modelo de proyecto que cree
var fs = require('fs');
var path = require('path');
const nodemailer = require("nodemailer");

var controller = {
    home: function (req, res) {
        return res.status(200).send({
            message: "Soy la home"
        });
    },

    test: function (req, res) {
        return res.status(200).send({
            message: "Soy el metodo o accion test del controlador"
        });
    },

    saveProject: function (req, res) {
        //Creo una variable de tipo project, el modelo que hicimos anteriormente
        var project = new Project();

        //Recojo los parametros que me lleguen
        var params = req.body;

        //Seteo las propiedades que recibo 
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.lang = params.lang;
        project.image = null;

        //Guardar en base de datos
        project.save((err, projectStored) => {
            if (err) {
                return res.status(500).send({
                    error: err,
                    message: "Error al guardar"
                });
            }

            if (!projectStored) {
                return res.status(404).send({
                    message: "No se a podido guardar el proyecto"
                });
            }

            return res.status(200).send({
                project: projectStored,
                message: "Project save!!"
            })

        });
    },

    getProject: function (req, res) {
        //Guardamos el id que mandamos por restful
        var projectId = req.params.id;

        //Buscamos proyectos por id relacionando el modelo
        Project.findById(projectId, (err, project) => {
            if (projectId == null) {
                return res.status(404).send({
                    message: "No se encontro el proyecto buscado"
                })
            }

            if (err) {
                return res.status(500).send({
                    message: "Error al devolver los datos",
                    error: err
                })
            }

            if (!project) {
                return res.status(404).send({
                    message: "No se encontro el proyecto buscado"
                })
            }

            return res.status(200).send({
                project
            })

        });
    },

    getProjects: function (req, res) {
        //Para sacar todos los elementos
        //dentro de las llaves del find podemos poner una condicion, por ejemplo years:2020 solo me va a sacar los que tengan ese año
        Project.find({}).sort('-year').exec((err, projects) => { //con el sort ordenamos el array
            if (err) {
                return res.status(500).send({
                    message: "Error al devolver los datos"
                });
            }

            if (projects == null) {
                return res.status(404).send({
                    message: "No hay proyectos para mostrar"
                });
            }

            return res.status(200).send({ projects })
        })
    },

    updateProject: function (req, res) {
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update, { new: true }, (err, projectUpdated) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al actualizar"
                });
            }

            if (!projectUpdated) {
                return res.status(404).send({
                    message: "No existe el proyecto que quiere actualizar"
                })
            }

            return res.status(200).send({
                project: projectUpdated
            });
        })
    },

    deleteProject: function (req, res) {
        var projectId = req.params.id;
        Project.findByIdAndDelete(projectId, (err, projectDeleted) => {
            if (err) {
                return res.status(500).send({
                    message: "No se ha podido borrar el proyecto"
                });
            }

            if (!projectDeleted) {
                return res.status(404).send({
                    message: "No existe el proyecto a eliminar"
                })
            }

            return res.status(200).send({
                project: projectDeleted,
                message: "Proyecto eliminado!"
            })

        })
    },

    uploadImage: function (req, res) {
        var projectId = req.params.id;
        var fileName = 'Imagen no subida';

        if (req.files) {
            var filePath = req.files.image.path; //Ruta del archivo
            var fileSplit = filePath.split('/');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('.');
            var fileExt = extSplit[1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Project.findByIdAndUpdate(projectId, { image: fileName }, { new: true }, (err, projectUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            message: "imagen no subida"
                        })
                    }

                    if (!projectUpdated) {
                        return res.status(404).send({
                            message: "El proyecto no existe, no puede subir la imagen"
                        })
                    }

                    return res.status(200).send({
                        files: projectUpdated
                    });
                })
            } else {
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({
                        message: "La extension no es valida"
                    });
                });
            }
        } else {
            return res.status(200).send({
                message: fileName
            });
        }
    },

    getImageFile: function (req, res) {
        var image = req.params.image;
        var path_file = './uploads/' + image;
        fs.exists(path_file, (exist) => {
            if (exist) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({
                    message: "no existe la imagen"
                })
            }
        })

    },

    sendMail: function (req, res) {
        require('dotenv').config(); //seguridad
        //Recojo los parametros que me lleguen
        var params = req.body;

        var emailData = {
            name: params.name,
            lastName: params.lastName,
            email: params.email,
            phone: params.phone,
            consult: params.consult,
            date: params.date
        }


        //var emailData=req.params.data;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass: process.env.PASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        var mailOptions = {
            from: "Gestor de consulta", // sender address
            to: process.env.TO, // list of receivers
            subject: "Consulta de " + emailData.name + " " + emailData.lastName,
            text: "Telefono: " + emailData.phone + " email: " + emailData.email + " Mensaje: " + emailData.consult + " Enviado el: " + emailData.date
        }

        //Send email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send({
                    message: "Error, email no enviado"
                })
            } else {
                return res.status(200).send({
                    message: "Email enviado!"
                });
            }
        })


    },

    login: function (req, res) {
        require('dotenv').config();
        var login = req.body;
        var user = process.env.USUARIO;
        var password = process.env.PASS;

        if (login.user == user) {
            if (login.password == password) {
                return res.status(200).send({
                    status: "success"
                })
            }

        } else {
            return res.status(200).send({
                status: "error",
            })
        }

    }

};

module.exports = controller;