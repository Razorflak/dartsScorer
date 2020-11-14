/*var http = require('http');

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Salut tout le monde !');
});
server.listen(8080);*/


// server.js
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
var request = require('request');

var http = require('http').Server(server);
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected: ' + socket.id);
  socket.on('disconnect', (disconnect) => {
	console.log('Déconnexion du user: ' + socket.id);
	});
});



server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

server.get("/", (req, res) => {
   res.sendFile(__dirname + '/CreateGame.html');
});

server.get("/test", (req, res) => {
	request('https://graph.facebook.com/260693775331290/comments?access_token=105e4ccc8a854bccf0f4f3a6a5f40a25',function(error,reponse,body){
		if (!error && response.statusCode == 200) {
			console.log(body) 
		}
		else {
			console.log("Error "+response.statusCode)
		}
	});

	res.sendFile(__dirname + '/testIframe.html');
  });

//Middleware
server.use(express.static(__dirname ));

// * Service pour recevoir un fichier "game"
server.post("/sendScoreToServer", function(req,res){
	//Chargement de tous les fichiers des games en Cours
	var path = require('path');
	var fs = require('fs');
	var t= __dirname;
	var id = req.body.id;
	if(id === undefined){
		return;
	}
	var filePath = path.join(__dirname,"CurrentMatches",id + ".xml");

	fs.writeFile(filePath,JSON.stringify(req.body),function(err){
		if(err){
			return console.log("Erreur de sauvegarde");
		}
		res.json(1);
	});
	//Envoi de l'objet Json vers l'écran display
	io.emit('inScore',req.body);
});


//* Service pour récupérer toutes les games en cours.
server.get("/getAllCurrentGame", function(req,res,next){
	//Chargement de tous les fichiers des games en Cours
	var t= __dirname;
	var fs = require('fs');
	var path = require('path');

	var directoryPath = path.join(__dirname,"CurrentMatches");
	
	var files = fs.readdirSync(directoryPath);
	var arrayMatch = new Array();
	files.forEach(element => {
		var contentMatch = readDataGame(path.join(directoryPath,element));
		arrayMatch.push(contentMatch);
	});
	res.json(arrayMatch);
});

//* Service pour récupérer une game spécifique
server.post("/getDataGame", function(req,res,next){
	//Chargement de tous les fichiers des games en Cours
	var fs = require('fs');
	var path = require('path');
	var result;
	var directoryPath = path.join(__dirname,"CurrentMatches");
	var id = req.body.id;
	var matchData;
	if(id === undefined){
		var files = fs.readdirSync(directoryPath);
		var arrayMatch = new Array();
		var mostRecentFile;
		var tempDateMostRecent = 0;
		files.forEach(element => {
			var curFilePath = path.join(directoryPath,element);
			stats = fs.statSync(curFilePath);
			if(stats.mtime > tempDateMostRecent){
				tempDateMostRecent = stats.mtime;
				mostRecentFile = curFilePath;
			}
		});
		result = readDataGame(mostRecentFile);
	}else{
		var curFilePath = path.join(directoryPath,id + ".xml");
		result = readDataGame(curFilePath);
	}
	res.json(result);
});

//* Service pour récupérer une game spécifique archivé
server.post("/getDataArchiveGame", function(req,res,next){
	//Chargement de tous les fichiers des games en Cours
	var fs = require('fs');
	var path = require('path');
	var result;
	var directoryPath = path.join(__dirname,"ArchivesMatches");
	var id = req.body.id;
	var matchData;
	if(id === undefined){
		var files = fs.readdirSync(directoryPath);
		var arrayMatch = new Array();
		var mostRecentFile;
		var tempDateMostRecent = 0;
		files.forEach(element => {
			var curFilePath = path.join(directoryPath,element);
			stats = fs.statSync(curFilePath);
			if(stats.mtime > tempDateMostRecent){
				tempDateMostRecent = stats.mtime;
				mostRecentFile = curFilePath;
			}
		});
		result = readDataGame(mostRecentFile);
	}else{
		var curFilePath = path.join(directoryPath,id + ".xml");
		result = readDataGame(curFilePath);
	}
	res.json(result);
});

// *Service pour valider la fin d'un match
server.post("/sendOnMatchWin", function(req,res,next){
	var fs = require('fs');
	var path = require('path');
	var gameFilePath = path.join(__dirname,"CurrentMatches",req.body.id + '.xml');
	var gameFileArchivePath = path.join(__dirname,"ArchivesMatches",req.body.id + '.xml');
	//Déplace le fichier vers le répertoire des archives
	fs.rename(gameFilePath, gameFileArchivePath,function(){
		console.log('fichier déplacer vers les archives:' + req.body.id + '.xml');
	});
	//Envoie d'un msg au display pour signifier la fin du match
	io.emit('matchWin',req.body);
});


function readDataGame(gameFilePath){
	if(gameFilePath === undefined){
		return null;
	}
	var fs = require('fs');
	var content = fs.readFileSync(gameFilePath, 'utf8');
	return content;
}

const port = 4001;



http.listen(port, () => {
    console.log(`Server listening at ${port}`);
});