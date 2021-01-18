var player1;
var player2;
var game;
var mancheInfo;

function onPageLoad(){
	loadAllCurrentGame();
	onTournoiChange();
}


function onCreateGame(){
	var tournoi = document.getElementById('inputCompetion').value;
	var nbrPlayerByTeam = tournoi.includes('Double')?2:1;
	var arrayTeam = new Array();
	for(var t = 0 ; t < 2 ; t++){
		var arrayPlayer = new Array();
		for(var p = 0 ; p < nbrPlayerByTeam ; p++){
			var idElemen = "player" + (p+1) + "Team" + (t+1);
			var nom = document.getElementById(idElemen + "Nom").value;
			var prenom = document.getElementById(idElemen + "Prenom").value;
			var player = new Player(nom,prenom,getRandomId());
			arrayPlayer.push(player);
		} 
		arrayTeam.push(arrayPlayer);
	}

	var nbrManche = document.getElementById("nbrManche").value;
	var nbrSet = document.getElementById("nbrSet").value;
	var stadeCompetition = document.getElementById("inputStade").value;
	var competition = document.getElementById("inputCompetion").value;
	game = new Game(arrayTeam[0],arrayTeam[1],nbrSet,nbrManche,tournoi,stadeCompetition);
	sendGameToServ(game);
}

function OnResetFields(){
	//Reset champs saisie infos Joueurs
	for(var t = 0 ; t < 2 ; t++){
		for(var p = 0 ; p < 2 ; p++){
			var idElemen = "player" + (p+1) + "Team" + (t+1);
			document.getElementById(idElemen + "Nom").value = "";
			document.getElementById(idElemen + "Prenom").value = "";
		} 
	}
}



function onTournoiChange(){
	let tournoi = document.getElementById('inputCompetion').value;
	if(tournoi.includes('Double')){
		document.getElementById('labelEquipe1').innerHTML = 'Equipe 1';
		document.getElementById('labelEquipe2').innerHTML = 'Equipe 2';
		var elemsp2 = document.getElementsByClassName('player2');
		for (var i = 0 ; i < elemsp2.length ; i++){
			elemsp2[i].style.visibility = "";
			elemsp2[i].style.height  = "";
		}
	}else{
		document.getElementById('labelEquipe1').innerHTML = 'Joueurs 1';
		document.getElementById('labelEquipe2').innerHTML = 'Joueurs 2';
		var elemsp2 = document.getElementsByClassName('player2');
		for (var i = 0 ; i < elemsp2.length ; i++){
			elemsp2[i].style.visibility = "hidden";
			elemsp2[i].style.height  = "0px";
		}
	}
}


function loadAllCurrentGame(){
	jQuery.ajax({
		url: '/getAllCurrentGame',
		complete: function(data){
			onLoadCurrentGame(data);
		}
	 });
}

function onLoadCurrentGame(resp){
	
	//Creation des lignes
	var new_row = document.createElement('div');
	new_row.className = "aClassName";
	var HtmlContent = "";
	HtmlContent += '<table class="table table-striped table-responsive">';
	HtmlContent += '<thead>';
		HtmlContent += '<tr>';
			HtmlContent += '<th>';
				HtmlContent += 'Joueurs';
			HtmlContent += '</th>';
			HtmlContent += '<th>';
				HtmlContent += 'Competition / Stade';
			HtmlContent += '</th>';
			HtmlContent += '<th>';
				HtmlContent += 'Action';
			HtmlContent += '</th>';
		HtmlContent += '</tr>';
	HtmlContent += '</thead>';	
	HtmlContent += '<tbody>';
	var result = resp.responseJSON;
	result.forEach(element => {
		
		var game = JSON.parse(element);
		var controleGame = new ControleGame(game);
		var player1 = controleGame.team1.displayName;
		var player2 = controleGame.team2.displayName;
		HtmlContent += '<tr>';
		HtmlContent += '<td>';
		HtmlContent += player1 + ' / ' + player2;
		HtmlContent += '</td>';
		HtmlContent += '<td>';
		HtmlContent += game.stadeCompetition + ' - ' + game.competition;
		HtmlContent += '</td>';
		HtmlContent += '<td>';
		HtmlContent += '<a href=ScorerClient.html?id=' + game.id + '>Reprendre scorage</a>';
		HtmlContent += '</td>';
		HtmlContent += '<td>';
		HtmlContent += '</td>';
		HtmlContent += '</tr>';
	});
	HtmlContent += '</tbody>';
	HtmlContent += '</table>';
	new_row.innerHTML = HtmlContent;
	document.getElementById('divCurrentGames').innerHTML = HtmlContent;
}

function sendGameToServ(game){
	var result;
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
						onFileXmlCreated();
				    }
			   }
	 });

}

function onFileXmlCreated(){
	var currentURL = window.location.href;
	window.location.href = 'ScorerClient.html?id=' + game.id;
}

function onGoToDisplay(){
	var currentURL = window.location.href;
	window.location.href = 'ScoreDisplay.html';
}
