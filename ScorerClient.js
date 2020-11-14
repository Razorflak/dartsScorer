function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	    vars[key] = value;
	});
	return vars;
 }

var game;
var controleGame;

function onPageLoad(){
	//openFullscreen(document.body);
	var elem = document.getElementById("nbrDartsContaineur");
	elem.style.visibility = "";
	elem.style.height  = "0%";
	onClr();
	loadDataXml();
	
}

function loadDataXml(){
	var vars = getUrlVars();
	var params = JSON.stringify({"id":vars.id});
	jQuery.ajax({
		type: "POST",
		url: '/getDataGame',
		dataType: "json",
		contentType: 'application/json', //see that
		data: params,
		success: function (resp) {
				    console.log(resp.responseText);
				    onRespReadXML(resp);
			   },
		error: function (xhr, status, error) {
			console.log( xhr.responseText);
		}	   
	 });

	
}

function onRespReadXML(result){
	game = JSON.parse(result);
	controleGame = new ControleGame(game);
	dataToDOM();
	gesAffichageBtnStart();
}

function dataToDOM(){
	document.getElementById("p1Name").innerHTML = controleGame.team1.displayName;
	document.getElementById("p1Score").innerHTML = controleGame.team1.score;
	document.getElementById("p1Set").innerHTML = controleGame.team1.set;
	document.getElementById("p1Manche").innerHTML = controleGame.team1.leg;
	document.getElementById("p1LastThrow").innerHTML = controleGame.getLastThrowScore(controleGame.team1);
	document.getElementById("p1NbrDarts").innerHTML = controleGame.getNbrDartsLeg(controleGame.team1);

	document.getElementById("p2Name").innerHTML =  controleGame.team2.displayName;
	document.getElementById("p2Score").innerHTML = controleGame.team2.score;
	document.getElementById("p2Set").innerHTML = controleGame.team2.set;
	document.getElementById("p2Manche").innerHTML = controleGame.team2.leg;
	document.getElementById("p2LastThrow").innerHTML = controleGame.getLastThrowScore(controleGame.team2);
	document.getElementById("p2NbrDarts").innerHTML = controleGame.getNbrDartsLeg(controleGame.team2);

	//Affiche actif/inactif
	//Mega relou ce truc alors on fait ça brut...
	document.getElementById("p1Div").classList.remove("activPlayer");
	document.getElementById("p2Div").classList.remove("activPlayer");
	if(game.indexActivTeam == 0){
		document.getElementById("p1Div").classList.add("activPlayer");
	}else{
		document.getElementById("p2Div").classList.add("activPlayer");
	}
	
}

function onPlayerStart(id){
	var teamClic = game.arrayTeams[id-1];
	controleGame.switchNextTeam();
	controleGame.currentLeg.startTeamId = controleGame.activTeam.id;
	gesAffichageBtnStart();
	dataToDOM();
	sendInfoToServ(game);
}

function gesAffichageBtnStart(){
	if(controleGame.getNbrThrowsCurrentLeg() == 0){
		var idTeamStarter = controleGame.currentLeg.startTeamId;
		if(idTeamStarter == controleGame.team1.id){
			document.getElementById("btnStartP1").style.visibility = "hidden";
			document.getElementById("btnStartP2").style.visibility = "";
		}else{
			document.getElementById("btnStartP1").style.visibility = "";
			document.getElementById("btnStartP2").style.visibility = "hidden";
		}
	}else{
		document.getElementById("btnStartP1").style.visibility = "hidden";
		document.getElementById("btnStartP2").style.visibility = "hidden";
	}

	dataToDOM();
}

function sendInfoToServ(game){
	var params = JSON.stringify( game,null, 3);
	jQuery.ajax({
		type: "POST",
		url: '/sendScoreToServer',
		headers : {
			'Content-Type' : 'application/json'
		 },
		data: params,
	 
		success: function (obj, textstatus) {
				    if( obj != "1" ) {
					   console.log("Error lors de l'écriture du fichier");
				    }else{
					    //On vérifie si un winner à été désigné
					    if (!(game.winnerTeam === undefined)){
						onPlayerWinMatch();
					    }
				    }
			   }
	 });

}

function onAddScore(num){
	//openFullscreen(document.getElementById("mainContainer"));
	//Gestion de l'ajout des score TODO
	var currentScore = document.getElementById("currentScore").innerHTML;
	var score = parseInt(currentScore.trim());
	var newScore;
	document.getElementById("btnValid").innerHTML = "V";
	document.getElementById("btnValid").style.fontSize  = "7vh";
	if(isNaN(score)){
		newScore = num;
	}else{
		newScore = score + num;
	}
	if(parseInt(newScore) > 180){
		//Truc visuel pour sire que c'est impossible
	}else{
		document.getElementById("currentScore").innerHTML = newScore;
	}
}


function onClr(){
	document.getElementById("currentScore").innerHTML = "&nbsp;";
	document.getElementById("btnValid").innerHTML = "No Score";
	document.getElementById("btnValid").style.fontSize  = "4vh";
}

function onValider(){
	var currentScore = document.getElementById("currentScore").innerHTML;
	if(currentScore == "&nbsp;"){
		currentScore = 0;
	}

	if(controleGame.activTeam.score - currentScore == 0){
		//L'équipe va gagner faut demander le nombre de fléchettes
		var elem = document.getElementById("nbrDartsContaineur");
		elem.style.visibility = "";
		elem.style.height  = "60%";
		
	}else{
		controleGame.addScore(currentScore);
		onClr();
		dataToDOM();
		gesAffichageBtnStart();
		sendInfoToServ(game);
	}
}

function onValiderNbrDarts(nbrDarts){
	var elem = document.getElementById("nbrDartsContaineur");
	elem.style.visibility = "";
	elem.style.height  = "0px";
	var currentScore = document.getElementById("currentScore").innerHTML;
	if(currentScore == "&nbsp;"){
		currentScore = 0;
	}
	controleGame.addScore(currentScore,nbrDarts);
	onClr();
	dataToDOM();
	gesAffichageBtnStart();
	sendInfoToServ(game);
}

function onUndo(){
	//Verif si Undo possible
	var currentLeg = controleGame.currentLeg;
	var throwThisLeg = game.throws.filter(aThrow => aThrow.legId == currentLeg.id);
	if (throwThisLeg.length == 0){
		//Pas de lancé sur cette leg, donc pas d'undo
		return;
	}
	var lastThrow = throwThisLeg[throwThisLeg.length -1];
	controleGame.switchNextTeam();
	controleGame.activTeam.score = controleGame.activTeam.score + Number.parseInt(lastThrow.score);
	//suppression du dernier lancé
	game.throws.pop();
	gesAffichageBtnStart();
	onClr();
	dataToDOM();
	sendInfoToServ(game);
}


function onPlayerWinMatch(){
	var params = JSON.stringify( game,null, 3);
	jQuery.ajax({
		type: "POST",
		url: '/sendOnMatchWin',
		headers : {
			'Content-Type' : 'application/json'
		 },
		data: params,
	 
		success: function (obj, textstatus) {
				    if( !('error' in obj) ) {
					   result = obj.result;
					   console.log(obj.result);
				    }
				    else {
					   console.log(obj.error);
				    }
			   }
	 });

	 window.location.replace('CreateGame.html');
}
function openFullscreen(elem) {
	if (elem.requestFullscreen) {
	  elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) { /* Firefox */
	  elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	  elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE/Edge */
	  elem.msRequestFullscreen();
	}
}

