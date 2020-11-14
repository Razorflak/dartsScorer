class ControleGame{
	constructor(match){
		this.match = match;
	}
	get currentSet(){
		return this.match.sets[this.match.sets.length - 1];
	}
	
	get currentLeg(){
		return this.match.legs[this.match.legs.length - 1];
	}
	
	get activTeam(){
		return this.match.arrayTeams[this.match.indexActivTeam];
	}
	
	switchNextTeam(){
		this.match.indexActivTeam = this.nextIdIndexActivTeam;
	}
	
	switchPreviousTeam(match){
		this.match.indexActivTeam = this.getPreviousIdIndexActivTeam(match);
	}
	
	get nextIdIndexActivTeam(){
		if(this.match.indexActivTeam == this.match.arrayTeams.length - 1){
			return 0;
		}else{
			return this.match.indexActivTeam + 1;
		}
	}
	
	get previousIdIndexActivTeam(){
		if(this.match.indexActivTeam == 0){
			return this.match.arrayTeams.length - 1;
		}else{
			return this.match.indexActivTeam - 1;
		}
	}

	get team1(){
		return this.match.arrayTeams[0];
	}

	get team2(){
		return this.match.arrayTeams[1];
	}



	getNextTeamId(currentTeamId){
		var indexCurrent = -1;
		for (var i = 0 ; i < this.match.arrayTeams.length ; i++){
			if (this.match.arrayTeams[i].id == currentTeamId){
				//trouvé!
				indexCurrent = i;
			}
		}
		if(indexCurrent == this.match.arrayTeams.length-1){
			return 0;
		}else{
			return indexCurrent++;
		}
	}
	
	
	addScore(score, darts = 3){
		var aThrow = new Throw(this.currentLeg.id,this.activTeam.id,score,darts);
		this.match.throws.push(aThrow);
		var tempScore =  this.activTeam.score - score;
		if(tempScore < 0){
			return;
		}
		this.activTeam.score = tempScore;
		if(this.activTeam.score == 0){
			this.onActivTeamWinLeg();
		}else{
			this.switchNextTeam();
		}
	}
	
	getIndexArrayTeams(teamId){
		for (var i = 0 ; i < this.match.arrayTeams.length ; i++){
			if(this.match.arrayTeams[i].id == teamId){
				return i;
			}
		}
	}
	
	onActivTeamWinLeg(){
		this.activTeam.leg ++;
		this.currentLeg.winnerTeam = this.activTeam.id;
		if(this.activTeam.leg == this.match.legNeed){
			//La team gagne le set
			this.activTeam.set ++;
			this.currentSet.winnerTeam = this.activTeam.id;
			//On reset les legs des équipes
			this.match.arrayTeams.forEach(team => {
				team.leg = 0;
			});
			if(this.activTeam.set == this.match.setNeed){
				this.onMatchWin();
				return;
			}else{
				var set = new Set();
				this.match.sets.push(set);
			}
		}
		this.match.arrayTeams.forEach(team => {
			team.score = 501;
		});

		//Gestion de qui commence la prochaine manche
		var teamStartPrevLeg = this.currentLeg.startTeamId;
		//On fait de la team qui à commencé la leg précédente la team active;
		var indexTeamStartPrevLeg = this.getIndexArrayTeams(teamStartPrevLeg);
		this.match.indexActivTeam = indexTeamStartPrevLeg;
		//On appel la fonction pour passer à l'équipe suivante
		this.switchNextTeam();
		var newLeg = new Leg(controleGame.currentSet.id,this.activTeam.id);
		this.match.legs.push(newLeg);
	}
	
	onMatchWin(){
		this.match.winnerTeam = this.activTeam;
		var params = JSON.stringify( this.match.id );
		jQuery.ajax({
			type: "POST",
			url: '/sendScoreToServer',
			dataType: 'json',
			data: params,
		
			success: function (obj, textstatus) {
					if( !('error' in obj) ) {
						result = obj.result;
						console.log(obj.result);
					}
					else {
						console.log(obj.error);
						window.location.replace('CreateGame.html');
					}
				}
		});

		
	}

	getLastThrowScore(team){
		var throws = this.match.throws;
		var idTeam = team.id;
		var legId = this.currentLeg.id;
		var result = throws.filter(athrow => (athrow.teamId == idTeam && athrow.legId == legId));
		if (result.length == 0){
			return 0;
		}else{
			return result[result.length-1].score;
		}
	}

	getNbrDartsLeg(team){
		var throws = this.match.throws;
		var idTeam = team.id;
		var legId = this.currentLeg.id;
		var result = throws.filter(athrow => (athrow.teamId == idTeam && athrow.legId == legId));
		return result.length * 3;
	}

	getNbrThrowsCurrentLeg(){
		var legId = this.currentLeg.id;
		var throws = this.match.throws;
		var result = throws.filter(athrow => (athrow.legId == legId));
		return result.length;
	}

	getTeamDisplayName(indexTeam){
		var team = this.match.arrayTeams[indexTeam];
		var result = ""
		team.players.forEach(player => {
			result += player.prenom + ' ' + player.nom.substring(0,1) + '.' + ' / '
		});
		result = result.substring(0,result.length-2);
	}
}
