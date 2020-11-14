class Game {
	constructor(	playersTeam1, //Array de players
				playersTeam2,	//Array de players
				setNeed,
				legNeed,
				stadeCompetition,
				competition)
	{
		this.id = getRandomId();
		this.setNeed = setNeed;
		this.legNeed = legNeed;
		this.indexActivTeam = 0;
		this.competition = competition;
		this.sets = new Array(); //de set
		this.stadeCompetition = stadeCompetition;
		this.arrayTeams = new Array();
		var t1 = new Team(playersTeam1);
		this.arrayTeams.push(t1);
		var t2 = new Team(playersTeam2);
		this.arrayTeams.push(t2);

		//Les sets/legs/throws sont contenu chacun dans un tableau sans distinction d'équipes, de set, de legs.
		//On utilisera des filtres pour faire des requête pour obtenir les infos ensuite.
		//Initialisation du tableau de Sets
		this.sets = new Array();
		var currentSet = new Set();
		this.sets.push(currentSet);
		//Initialisation du tableau de Legs
		this.legs = new Array();
		this.legs.push(new Leg(currentSet.id,t1.id));
		//Initialisation du tableau de throws
		this.throws = new Array();
	}
	arrayTeams;
	indexActivTeam; //index de l'équipe active du tableau arrayTeamsOrder
	winnerTeam;

	
}

class Team{
	constructor(players){
		this.typeTeam = (players.length == 2) ? "DOUBLE" : "SIMPLE";
		this.players = players;
		this.id = getRandomId();
		this.displayName = "";
		for (var i = 0 ; i < players.length ; i++){
			players[i].idTeam = this.id;
			this.displayName += this.players[i].displayName + " ";
		}
		this.score = 501;
		this.leg = 0;
		this.set = 0;

	}
	isActivTeam = false;
}

class Player {
	constructor(nom,prenom,id){
		this.nom = nom;
		this.prenom = prenom;
		this.id = id;
		this.displayName = prenom + ' ' + nom.substring(0,1) + '.';
	}
}

class Set{
	constructor(){
		this.id = getRandomId();
	}
	winnerTeam;
}

class Leg{
	constructor(setId, startTeamId){
		this.setId = setId;
		this.id = getRandomId();
		this.startTeamId = startTeamId;
	}
	winnerTeam;
}

class Throw{
	constructor(legId, teamId, score, darts = 3){
		this.teamId = teamId;
		this.score = score;
		this.darts = darts;
		this.legId = legId;
	}
}

function getRandomId(){
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

