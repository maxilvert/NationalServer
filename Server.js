//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express. 

var express = require('express');
var bodyParser = require("body-parser")
var upload = require("multer")()

// Nous définissons ici les paramètres du serveur.
var hostname = 'localhost'; 
var port = 3000; 

// Nous créons un objet de type Express. 
var app = express(); 
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'cesi_user'
});

connection.connect(function(err) {
	if (err) throw err
		console.log('You are now connected...')
})

//POST
app.post("/:table",upload.none(),function(req,res,field){
	var nom_bool=false;
	var prenom_bool= false;
	var id_centres_bool=false;
	var mail_bool=false;
	var mdp_bool=false;
	var obj = Object.entries(req.body);
	var TabChamp=[]
	obj.forEach(function(element) {
		if (element[0]=="nom") {
			nom_bool=true;
			TabChamp[0] = element[1];
		}
		else if (element[0]=="prenom") {
			prenom_bool=true;
			TabChamp[1] = element[1];
		}
		else if (element[0]=="id_centres") {
			id_centre_bool=true;
			TabChamp[2] = element[1];
		}
		else if (element[0]=="email") {
			mail_bool=true
			TabChamp[3] = element[1];
		}
		else if (element[0]=="password") {
			mdp_bool=true
			TabChamp[4] = element[1];
		}
	})

	if (nom_bool && prenom_bool && id_centre_bool && mail_bool && mdp_bool) {
		var sql = 'INSERT INTO '+ req.params["table"] +' (nom, prenom ,id_centres, email, password) values (?,?,?,?,?)';
		var champ = [TabChamp[0],TabChamp[1],TabChamp[2],TabChamp[3],TabChamp[4]];
		sql = mysql.format(sql, champ);
		connection.query(sql, function(err,result,req,field)
		{
			if (err)
			{
				console.error(err.stack);
			}
			else{
				res.json(result);
			};

		})
	}

})


app.delete("/:table/:id",upload.none(),function(req,res,field){
	var sql= 'DELETE FROM '+ req.params["table"] +' WHERE id = '+ req.params["id"]
	connection.query(sql, function(err,result){
		if (err) {
			console.error(err.stack);
		}
		else{
			res.json(result);
		}
	});
})

//Permet avec la méthode get de demander d'avoir la liste des élèves en le demandant dans l'url
app.get("/:table",upload.none(),function(req,res,field){
	if (Object.keys(req.query).length !== 0) {
		var obj = Object.entries(req.query)
		var TabPut=[]
		var i = 0
		obj.forEach(function(element) {
			if (typeof element[1] == 'string') {
				element[1] = "'" + element[1] + "'"
			}
			TabPut[i] = element.join("=")
			i++
		})
		var str = TabPut.join(' AND ');
		connection.query('SELECT*FROM '+ req.params["table"] + ' WHERE ' + str, function(err,result){
			if (err) {
				console.error(err.stack);
			}
			else{
				if (result.length == 1) {
					res.json(result[0]);
				} else {
					res.json(result);
				}
			}
		});
	} else {
		connection.query('SELECT*FROM '+ req.params["table"], function(err,result){
			if (err) {
				console.error(err.stack);
			}
			else{
				if (result.length == 1) {
					res.json(result[0]);
				} else {
					res.json(result);
				}
			}
		});
	}
})

app.get('/:table/:id',upload.none(),function(req,res,field){
	var queryStringGET ='SELECT*FROM '+ req.params["table"] +' WHERE Id='+ mysql.escape(req.params["id"]);
	connection.query(queryStringGET, function(err,result){
		if (err) {
			console.error(err.stack);
		}
		else{
			if (result.length == 1) {
				res.json(result[0]);
			} else {
				res.json(result);
			}
		}
	});
})

app.put("/:table/:id",upload.none(),function(req,res,field){
	var table=req.params["table"]
	var id = req.params["id"]
	var objPut = Object.entries(req.body)
	var TabPut=[]
	var i = 0
	objPut.forEach(function(element) {
		if (typeof element[1]=='string') {
			element[1] = '"' + element[1] + '"'
		}
		TabPut[i] = element.join("=")
		i++
	})
	var str = TabPut.join(', ')
	console.log(str)
	var sql= "UPDATE "+table+" SET "+str+ " WHERE id = "+ id
	connection.query(sql, function(err,result){
		if (err) {
			console.error(err.stack);
		}
		else{
			res.json(result);
		}
	});
})

// Démarrer le serveur 
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});



