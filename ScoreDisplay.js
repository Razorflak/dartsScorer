var controle;
var game;
var sock;
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	    vars[key] = value;
	});
	return vars;
 }

function onPageLoad(){
	var urlJson = parseURL(window.location.href);
	var urlSocket = 'http://' + urlJson.host;
	sock = io(urlSocket);
	sock.on('inScore',function(arg){
		onRespReadXML(arg);
	});

	sock.on('matchWin',function(arg){
		onRespReadXML(arg);
	});
	loadDataXml();
}

function loadDataXml(){
	var vars = getUrlVars();
	var params = {"id":vars.id};
	jQuery.ajax({
		type: "POST",
		url: '/getDataGame',
		dataType: "json",
		contentType: 'application/json', //see that
		data: params,
		success: function (resp) {
				    console.log(resp.responseText);
				    onRespReadXML(JSON.parse(resp));
			   },
		error: function (xhr, status, error) {
			console.log( xhr.responseText);
		}	   
	 });

	
}


function onRespReadXML(result){
	game = result;
	controle = new ControleGame(game);
	
	
	document.getElementById("stadeCompetition").innerHTML = game.competition.toUpperCase() + " - " + game.stadeCompetition.toUpperCase();

	document.getElementById("nbrMancheGagnante").innerHTML = game.legNeed + " MANCHES GAGNANTES";

	

	document.getElementById("player1Name").innerHTML = game.arrayTeams[0].displayName;
	document.getElementById("player2Name").innerHTML = game.arrayTeams[1].displayName;

	document.getElementById("player1Leg").innerHTML = game.arrayTeams[0].leg;
	document.getElementById("player2Leg").innerHTML = game.arrayTeams[1].leg;

	document.getElementById("player1Score").innerHTML = game.arrayTeams[0].score;
	document.getElementById("player2Score").innerHTML = game.arrayTeams[1].score;
	
	//Gestion de la flèche pour dire qui joue
	document.getElementById("f1").classList.remove("activ");
	document.getElementById("f2").classList.remove("activ");
	if(game.indexActivTeam == 0){
		document.getElementById("f1").classList.add("activ");
	}else{
		document.getElementById("f2").classList.add("activ");
	}

	//Gestion du point pour dire qui a commencé la manche
	var teamStartId = controle.currentLeg.startTeamId;
	var teamStartIndex = controle.getIndexArrayTeams(teamStartId);

	document.getElementById('r1').classList.remove("starterLeg");
	document.getElementById('r2').classList.remove("starterLeg");
	if(teamStartIndex == 0){
		document.getElementById('r1').classList.add("starterLeg");
	}else{
		document.getElementById('r2').classList.add("starterLeg");
	}

	
}

function parseURL(url) {
	var parser = document.createElement('a'),
	    searchObject = {},
	    queries, split, i;
	// Let the browser do the work
	parser.href = url;
	// Convert query string to object
	queries = parser.search.replace(/^\?/, '').split('&');
	for( i = 0; i < queries.length; i++ ) {
	    split = queries[i].split('=');
	    searchObject[split[0]] = split[1];
	}
	return {
	    protocol: parser.protocol,
	    host: parser.host,
	    hostname: parser.hostname,
	    port: parser.port,
	    pathname: parser.pathname,
	    search: parser.search,
	    searchObject: searchObject,
	    hash: parser.hash
	};
 }