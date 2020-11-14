var arrayBar;
var arrayColorT1 = ["#7ed957","#b3d957"];
var arrayColorT2 = ["#ff5757","#ff7557"];

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	    vars[key] = value;
	});
	return vars;
 }

var player1 = {
	manche : 3,
	moyenne : 55.2,
	bestLeg : 18,
	bestFinish: 70,
	bestTrow : 140,
	t60 : 10,
	t100 : 5,
	t140 : 2,
	t170 : 1,
	t180 : 0
}

var player2 = {
	manche : 0,
	moyenne : 48,
	bestLeg : 0,
	bestFinish: 70,
	bestTrow : 140,
	t60 : 4,
	t100 : 1,
	t140 : 4,
	t170 : 2,
	t180 : 1
}


function onLoad(){
	document.getElementById("mainContaineur").style.visibility='visible';
	loadDataXml();
	
}

function loadDataXml(){
	var vars = getUrlVars();
	var params = {"id":vars.id};
	jQuery.ajax({
		type: "POST",
		url: '/getDataArchiveGame',
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
	document.getElementById("mainContaineur").style.visibility='visible';
	arrayBar = new Array();
	var colorP10 = "#7ed957";
	var colorP20 = "#ff5757";
	var colorP11 = "#b3d957";
	var colorP21 = "#ff7557";
	var game = result;
	var throwsT1 = game.throws.filter(athrow => athrow.teamId == game.arrayTeams[0].id);
	var throwsT2 = game.throws.filter(athrow => athrow.teamId == game.arrayTeams[1].id);

	var colorP1 = "red";
	var colorP2 = "green";
	//document.getElementById('header').style.width = '50%';
	//Manche
		//Calcul
	var legT1 = game.legs.filter(leg => leg.winnerTeam == game.arrayTeams[0].id);
	var legT2 = game.legs.filter(leg => leg.winnerTeam == game.arrayTeams[1].id);
		//Mise en pagne
	var max = Math.max(legT1.length,legT2.length);
	var percent = getPourcentageWidth(legT1.length,max);
	addBartoArray('manchesPlayer1',percent,colorP10,legT1.length);

	percent = getPourcentageWidth(legT2.length,max);
	addBartoArray('manchesPlayer2',percent,colorP20,legT2.length);
	
	//Moyennes
	var moyenneT1 = calcMoyenne(throwsT1);
	var moyenneT2 = calcMoyenne(throwsT2);
	max = Math.max(moyenneT1,moyenneT2);
	


	percent = getPourcentageWidth(moyenneT1,max);
	addBartoArray('moyennePlayer1',percent,colorP11,moyenneT1);
	
	percent = getPourcentageWidth(moyenneT2,max);
	addBartoArray('moyennePlayer2',percent,colorP21,moyenneT2);
	
	//bestLeg
	var bestLegT1 = calcBestLeg(throwsT1,legT1);
	var bestLegT2 = calcBestLeg(throwsT2,legT2);
	max = Math.max(bestLegT1,bestLegT2);
	
	percent = getPourcentageWidth(bestLegT1,max);
	addBartoArray('bestLegPlayer1',percent,colorP10,bestLegT1);
	
	percent = getPourcentageWidth(bestLegT2,max);
	addBartoArray('bestLegPlayer2',percent,colorP20,bestLegT2);
	
	//bestFinish
	var bestFinishT1 = calcBestFinish(throwsT1,legT1);
	var bestFinishT2 = calcBestFinish(throwsT2,legT2);
	max = 170;
	
	percent = getPourcentageWidth(bestFinishT1,max);
	addBartoArray('bestFinishPlayer1',percent,colorP11,bestFinishT1);
	
	percent = getPourcentageWidth(bestFinishT2,max);
	addBartoArray('bestFinishPlayer2',percent,colorP21,bestFinishT2);
	
	//bestTrow
	var maxScoreT1 = Math.max.apply(Math, throwsT1.map(function(o) { return o.score; }))
	var maxScoreT2 = Math.max.apply(Math, throwsT2.map(function(o) { return o.score; }))
	max = 180;
	
	percent = getPourcentageWidth(maxScoreT1,max);
	addBartoArray('bestThrowPlayer1',percent,colorP10,maxScoreT1);
	
	percent = getPourcentageWidth(maxScoreT2,max);
	addBartoArray('bestThrowPlayer2',percent,colorP20,maxScoreT2);
	
	//t60
	var s60T1 = throwsT1.filter(aThrow => aThrow.score >= 60 && aThrow.score < 100).length;
	var s60T2 = throwsT2.filter(aThrow => aThrow.score >= 60 && aThrow.score < 100).length;

	var s100T1 = throwsT1.filter(aThrow => aThrow.score >= 100 && aThrow.score < 140).length;
	var s100T2 = throwsT2.filter(aThrow => aThrow.score >= 100 && aThrow.score < 140).length;

	var s140T1 = throwsT1.filter(aThrow => aThrow.score >= 140 && aThrow.score < 170).length;
	var s140T2 = throwsT2.filter(aThrow => aThrow.score >= 140 && aThrow.score < 170).length;

	var s170T1 = throwsT1.filter(aThrow => aThrow.score >= 170 && aThrow.score < 180).length;
	var s170T2 = throwsT2.filter(aThrow => aThrow.score >= 170 && aThrow.score < 180).length;

	var s180T1 = throwsT1.filter(aThrow => aThrow.score == 180).length;
	var s180T2 = throwsT2.filter(aThrow => aThrow.score == 180).length;

	max = Math.max(s60T1,s100T1,s140T1,s170T1,s180T1,
		s60T2,s100T2,s140T2,s170T2,s180T2);
	
	percent = getPourcentageWidth(s60T1,max);
	addBartoArray('60Player1',percent,colorP11,s60T1);
	
	percent = getPourcentageWidth(s60T2,max);
	addBartoArray('60Player2',percent,colorP21,s60T2);
	
	//t100
	percent = getPourcentageWidth(s100T1,max);
	addBartoArray('100Player1',percent,colorP10,s100T1);
	
	percent = getPourcentageWidth(s100T2,max);
	addBartoArray('100Player2',percent,colorP20,s100T2);
	
	//t140
	percent = getPourcentageWidth(s140T1,max);
	addBartoArray('140Player1',percent,colorP11,s140T1);
	
	percent = getPourcentageWidth(s140T2,max);
	addBartoArray('140Player2',percent,colorP21,s140T2);
	
	//t170
	percent = getPourcentageWidth(s170T1,max);
	addBartoArray('170Player1',percent,colorP10,s170T1);
	
	percent = getPourcentageWidth(s170T2,max);
	addBartoArray('170Player2',percent,colorP20,s170T2);
	
	//t180
	percent = getPourcentageWidth(s180T1,max);
	addBartoArray('180Player1',percent,colorP11,s180T1);
	
	percent = getPourcentageWidth(s180T2,max);
	addBartoArray('180Player2',percent,colorP21,s180T2);

	//Nom d'équipe
	document.getElementById("TeamName1").innerHTML = game.arrayTeams[0].displayName;
	document.getElementById("TeamName2").innerHTML = game.arrayTeams[1].displayName;
	document.getElementById("stadeCompetition").innerHTML = game.stadeCompetition + " - " + game.competition;
	

	setTimeout(function(){
		startAnimationBars(0);
	},1000);
}

function calcMoyenne(throws){
	var nbrDarts = 0;
	var totalScore = 0;
	throws.forEach(element => {
		nbrDarts += parseInt(element.darts);
		totalScore += parseInt(element.score);
	});
	return (totalScore/nbrDarts*3).toFixed(2);
}

function calcBestLeg(throws, legsWin){
	var result = 9999;
	legsWin.forEach(element => {
		var darts = 0;
		var throwsW = throws.filter(athrow => athrow.teamId == element.winnerTeam && athrow.legId == element.id);
		throwsW.forEach(element => {
			darts += element.darts;
		});
		if(parseInt(darts) < parseInt(result)){
			result = darts;
		}
	});
	if(result == 9999){
		result = 0;
	}
	return result;
}

function calcBestFinish(throws, legsWin){
	var result = 0;
	legsWin.forEach(element => {
		var finish = 0;
		var throwsW = throws.filter(athrow => athrow.teamId == element.winnerTeam && athrow.legId == element.id);
		finish = throwsW[throwsW.length-1].score;
		if(parseInt(finish) > parseInt(result)){
			result = finish;
		}
	});
	if(result == 9999){
		result = 0;
	}
	return result;
}

function startAnimationBars(index){
	var currentBar = arrayBar[index];
	setDataGraph(currentBar.bar,currentBar.percent, currentBar.color, currentBar.data);
	currentBar = arrayBar[index++];
	setDataGraph(currentBar.bar,currentBar.percent, currentBar.color, currentBar.data);
	if(index < arrayBar.length){
		setTimeout(function(){
		startAnimationBars(index);
		},100);
	}
}

function addBartoArray(bar,percent,color,data){
	arrayBar.push({bar: bar, percent: percent, color: color, data:data});
}

function setDataGraph(div,percent,color,content){
	
	document.getElementById(div).innerHTML = content;
	if(percent > 0){
		document.getElementById(div).style.backgroundColor = color;
		
	}
	animatedBar(div,0,percent);
	//document.getElementById(div).style.width = percent + '%';
	
}

function getPourcentageWidth (val, max){
	return val*100/max;
}

function animatedBar(documentBar,currentPercent,targetPercent,speed = 2){
	var diff = targetPercent - currentPercent;
	if(diff < 10){
		speed = 15;
	}else if(diff < 20){
		speed = 7;
	}else{
		speed = 1;
	}
	//speed = speed + 1 ;
	document.getElementById(documentBar).style.width = currentPercent + '%';
	var currWidth = document.getElementById(documentBar).clientWidth;
	if(currentPercent <= targetPercent || currWidth < 45){
		
		setTimeout(function(){
			animatedBar(documentBar,currentPercent + 0.6, targetPercent, speed);
		},speed);
	}
}