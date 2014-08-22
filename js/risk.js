var Risk = {
	colors: [
	'rgb(200, 0, 0)',//red
	'rgb(0, 200, 0)',//green
	'rgb(30, 80, 200)',//blue
	'rgb(255, 255, 0)',//yellow
	'rgb(255, 140, 30)',//orange
	'rgb(150, 150, 150)'//gray
	],
	names: [
	'Campbell',
	'Mackenzie',
	'Wellington',
	'Bonaparte',
	'Marmont',
	'Barbacena',
	"D'Erlon",
	'Maransin',
	'Solignac',
	'Sherbrooke',
	'Aubert',
	'Spencer',
	'Taupin',
	'Friere',
	'Vauban',
	'Baird'
	],
	missions: [
	'Dominate the World',
	'Capture Europe, Australia and one other continent',
	'Capture Europe, South America and one other continent',
	'Capture North America and Africa',
	'Capture North America and Australia',
	'Capture Asia and South America',
	'Capture Asia and Africa',
	'Capture 24 territories',
	'Capture 18 territories and occupy each with two troops',
	'Destroy all armies of a specific color'
	],
	mission: 0,
	maxPlayers: 6,
	players: [],
	currentPlayer: undefined,
	cards: [],
	cardValue: 4,
	validPair: false,
	
	setup: function(_r)
	{
		this.r = _r;
		this.holderW = 100;
		this.dieSize = 16;
		//setup cards
		var types = ['infantry', 'cavalry', 'artillery'];
		Map.forAllTerritories(function(territory, continent)
		{
			this.cards.push(new card(types[Math.round(Math.random() * 2)], this.cardCb,
				territory.name, territory.path, continent.color));
		}, this);
		this.cards.push(new card('wild', this.cardCb));
		this.cards.push(new card('wild', this.cardCb));
		//setup attack controls
		this.holders = [
			this.r.rect(0, 0, this.holderW, territoryCircleRadius[0] * 2, 5).attr({
				'stroke-width': 0,
				'fill': '#000'
			}),
			this.r.rect(0, 0, this.holderW, territoryCircleRadius[0] * 2, 5).attr({
				'stroke-width': 0,
				'fill': '#000'
			})
		];
		this.dice = [
			[
				new dice(0, 0, this.dieSize, this.dieSize, this.r),
				new dice(0, 0, this.dieSize, this.dieSize, this.r),
				new dice(0, 0, this.dieSize, this.dieSize, this.r)
			],
			[
				new dice(0, 0, this.dieSize, this.dieSize, this.r),
				new dice(0, 0, this.dieSize, this.dieSize, this.r)
			]
		];
		this.offCircle = this.r.circle(0, 0, territoryCircleRadius[0]);
		this.offText = this.r.text(0, 0, 0);
		this.defCircle = this.r.circle(0, 0, territoryCircleRadius[0]);
		this.defText = this.r.text(0, 0, 0);
		this.attackControls = this.r.group([this.holders,
			this.dice[0][0].set,
			this.dice[0][1].set,
			this.dice[0][2].set,
			this.dice[1][0].set,
			this.dice[1][1].set,
			this.offCircle, this.offText, this.defCircle, this.defText]).hide();
	},
	
	setActivePlayer: function(num)
	{
		$('#queue div').css('width', 10);
		document.getElementById('queue').children[num].style.width = '100px';
	},
	
	startGame: function()
	{
		//choose territories and place armies
		var territories_pp = [];
		while(territories_pp.length < this.players.length) territories_pp.push(50 - this.players.length * 5);
		function chooseTerritories(player, num)
		{
			Risk.setActivePlayer(player);
			Risk.players[player].chooseTerritory(territories_pp[player], function()
			{
				territories_pp[player]--;//one army less
				num++;//one territory more capured
				if(player + 1 == Risk.players.length) player = 0;
				else player++;
				if(num < Map.territories) chooseTerritories(player, num);//not all territories are captured
				else placeArmies(player);//all territories are captured -> place left armies
			});
		};
		function placeArmies(player)
		{
			Risk.setActivePlayer(player);
			if(territories_pp[player] == 0) round(0);//all players have spended their armies -> start rounds
			else Risk.players[player].placeArmies(territories_pp[player], function()
			{
				territories_pp[player] = 0;//no armies left
				player++;//next player
				if(player < Risk.players.length) placeArmies(player);
				else placeArmies(0);
			});
		};
		chooseTerritories(0, 0);
		
		//start rounds
		function round(player)
		{
			Risk.setActivePlayer(player);
			Risk.currentPlayer = Risk.players[player];
			//draw cards
			Risk.currentPlayer.cards.forEach(function(card, num)
			{
				card.draw($('#cardsDialog .table .cell:eq(' + num + ')'));
			});
			//start
			Risk.players[player].startRound(function()
			{
				//clear cards
				Risk.currentPlayer.cards.forEach(function(card, num)
				{
					card.clear();
				});
				$('#cardsDialog .message').html('');
				$('#cardsDialog .trade').attr('class', 'trade dialogButton inactive');
				player++;//next player
				if(player < Risk.players.length) round(player);
				else round(0);
			});
		};
	},
	
	endGame: function()
	{
		//clear cardsDialog
		$('#cardsDialog .table .cell').html('').attr('class', 'cell card');
		$('#cardsDialog .message').html('');
		$('#cardsDialog .trade').attr('class', 'trade dialogButton inactive');
		//reset internals
		currentPlayer: undefined,
		this.cardValue = 4;
		//remove all players
		this.players.forEach(function(player)
		{
			Risk.cards.concat(player.cards);
		});
		this.players = [];
	},
	
	startAttack: function(invader, defender, callback)
	{
		//if(!invader.armies > 1) callback(false);
		//set values used during attack
		this.invader = invader;//invader territory
		this.defender = defender;//defender territory
		this.attackCb = callback;//callback when ready
		this.offArmies = invader.armies - 1;//number of invader armies
		this.offRadius = getRadius(this.offArmies);//number of invader armies
		invader.setArmies(1);//1 army is left in the offenders territory
		//set interface
		$('#endButton').hide();
		$('#retreatButton').show();
		$('#throwButton').show();
		$('#throwButton').removeClass('inactive').addClass('active');
		$('#retreatButton').removeClass('inactive').addClass('active');
		Map.setClickCb(undefined);
		//set positions
		var offset = 5 + this.offRadius + defender.radius;
		var toLeft = 0;
		var yPos = -1;
		if(defender.cx - this.holderW > 0) toLeft = 1;//holder to left
		if(defender.cy < invader.cy) yPos = 1;//offendor below defendor
		this.offCircle.attr({
			'cx': defender.cx,
			'cy': defender.cy + yPos * offset,
			'r': this.offRadius,
			'fill': invader.color
		});
		this.offText.remove();
		this.offText = this.r.text(defender.cx, defender.cy + yPos * offset, this.offArmies);
		this.defCircle.attr({
			'cx': defender.cx,
			'cy': defender.cy,
			'r': defender.radius,
			'fill': defender.color
		});
		this.defText.remove();
		this.defText = this.r.text(defender.cx, defender.cy, defender.armies);
		this.holders[0].attr({
			'x': defender.cx - toLeft * this.holderW,
			'y': defender.cy - territoryCircleRadius[0]
		});
		this.holders[1].attr({
			'x': defender.cx - toLeft * this.holderW,
			'y': defender.cy - territoryCircleRadius[0] + yPos * offset
		});
		this.attackControls.push([this.offText, this.defText]);
		//reset dice positions
		var topMargin = territoryCircleRadius[0] - this.dieSize / 2;
		var startX = defender.cx - toLeft * this.holderW + topMargin;
		var scope = this;
		this.dice[0].forEach(function(die, num)//invader dices
		{
			die.replace(startX + toLeft * num * (scope.dieSize + topMargin),
				defender.cy + yPos * offset - territoryCircleRadius[0] + topMargin);
			die.setEyes(0);
		});
		this.dice[1].forEach(function(die, num)//defender dices
		{
			die.replace(startX + toLeft * num * (scope.dieSize + topMargin),
				defender.cy - territoryCircleRadius[0] + topMargin)
			die.setEyes(0);
		});
		//let conflicting territories shine
		Map.forAllTerritories(function(territory)
		{
			territory.setState('normal');
		});
		invader.setState('shine');
		defender.setState('shine');
		//start
		this.setDice();
		this.attackControls.show();
	},
	
	throwDice: function()
	{
		var result = [[], []];
		for(var num = 0; num < this.offDice; num++)
			result[0].push(Math.round(Math.random() * 5 + 1));
		for(var num = 0; num < this.defDice; num++)
			result[1].push(Math.round(Math.random() * 5 + 1));
		result[0].sort(function(a, b){ return b-a; });
		result[1].sort(function(a, b){ return b-a; });
		this.dice[0].forEach(function(die, num)//invader dices
		{
			die.setEyes(result[0][num]);
		});
		this.dice[1].forEach(function(die, num)//defender dices
		{
			die.setEyes(result[1][num]);
		});
		$('#throwButton').removeClass('active').addClass('inactive');
		$('#retreatButton').removeClass('active').addClass('inactive');
		function attack(invader, defender, num, callback)
		{
			if(invader && defender) window.setTimeout(function()
			{
				if(invader > defender)//invader has won
				{
					var armies = Risk.defender.armies - 1;
					Risk.dice[0][num].highlight();
					Risk.defText.attr('text', armies);
					Risk.defender.setArmies(armies);
					playShotSound(armies > 0 ? callback : function()
					{
						Risk.endAttack(2)//defender is defeated
					});
				}
				else//defender has won (in case of a tie, the defender always wins)
				{
					Risk.offArmies--;
					Risk.dice[1][num].highlight();
					Risk.offText.attr('text', Risk.offArmies);
					Risk.offRadius = getRadius(Risk.offArmies);
					Risk.offCircle.attr('r', Risk.offRadius);
					playShotSound(Risk.offArmies > 0 ? callback : function()
					{
						Risk.endAttack(0)//invader is defeated
					});
				}
			});
			else callback();
		};
		window.setTimeout(function()
		{
			attack(result[0][0], result[1][0], 0, function()
			{
				attack(result[0][1], result[1][1], 1, function()
				{
					$('#throwButton').removeClass('inactive').addClass('active');
					$('#retreatButton').removeClass('inactive').addClass('active');
					Risk.setDice.call(Risk);
				});
			});
		}, 250);
	},
	
	setDice: function()
	{
		switch(this.offArmies)
		{
			case 0: console.error('setDice called while offArmies == 0'); break;
			case 1://invader has one die
				this.dice[0][1].hide();
				this.dice[0][2].hide();
				this.offDice = 1;
				break;
			case 2://invader has two dice
				this.dice[0][1].show();
				this.dice[0][2].hide();
				this.offDice = 2;
				break;
			default://invader has three dice
				this.dice[0][1].show();
				this.dice[0][2].show();
				this.offDice = 3;
				break;
		}
		switch(this.defender.armies)
		{
			case 0: console.error('setDice called while defArmies == 0'); break;
			case 1://defender has one die
				this.dice[1][1].hide();
				this.defDice = 1;
				break;
			default://defender has two dice
				this.dice[1][1].show();
				this.defDice = 2;
				break;
		}
	},
	
	endAttack: function(reason)
	{
		$('#retreatButton').hide();
		$('#throwButton').hide();
		Map.forAllTerritories(function(territory)
		{
			territory.setState('normal');
		});
		this.attackControls.hide();
		switch(reason)
		{
			case 0://lost
				this.attackCb.call(this.currentPlayer, false, this.offArmies);
				return;
			case 1://retreat
				this.attackCb.call(this.currentPlayer, false, this.offArmies);
				return;
			case 2://won
				//find who the defending player is
				var num = 0;
				for(num; num < this.players.length; num++)
				{
					if(this.players[num].color == this.defender.color) break;
				}
				//check if defending player is eliminated
				var territoryNumber = 0;
				Map.forAllTerritories(function(territory)
				{
					if(territory.color == this.players[num].color) territoryNumber++;
				}, Risk);
				if(territoryNumber == 1)//this was the last territory
				{
					$('#messageBox').html(this.players[num].name + ' is eliminated by ' + this.currentPlayer.name);
					$('#okButton').show().unbind().click(function()
					{
						$('#okButton').hide();
						//pass cards of eliminated player
						Risk.attackCb.call(Risk.currentPlayer, true, Risk.offArmies, Risk.players[num].cards);
						//remove eliminated player
						Risk.players.splice(num, 1);
						var queue = document.getElementById('queue');
						queue.removeChild(queue.children[num]);
						//make queue smaller because there is one player less
						queue.style.width = parseInt(queue.style.width) - 10 + 'px';
						$('#messageBox').css('left', parseInt(queue.style.width));
					});
					return;
				}
				//not eliminated
				this.attackCb.call(this.currentPlayer, true, this.offArmies);
				return;
		}
	},
	
	divideArmies: function(a, b, armies, callback)
	{
		$('#divideDialog span.source').html(a.name);
		$('#divideDialog span.target').html(b.name);
		var source = $('#divideDialog input.source');
		var target = $('#divideDialog input.target');
		//unbind events previously used
		source.unbind();
		target.unbind();
		$('#divideDialog .ok').unbind();
		//bind new events
		source.val(1).change(function(e)
		{
			if(source.val() > armies - 1){ source.val(armies - 1); target.val(1); }
			else if(source.val() < 1){ source.val(1); target.val(armies - 1); }
			else target.val(armies - source.val());
		});
		target.val(armies - 1).change(function(e)
		{
			if(target.val() > armies - 1){ target.val(armies - 1); source.val(1); }
			else if(target.val() < 1){ target.val(1); source.val(armies - 1); }
			else source.val(armies - target.val());
		});
		$('#divideDialog .ok').click(function()
		{
			hideDialogs();
			window.setTimeout(function()
			{
				callback.call(Risk.currentPlayer, parseInt(source.val()), parseInt(target.val()));
			}, 300);
		});
		showDialog('#divideDialog');
	},
	
	recieveCard: function()
	{
		var num = Math.round(Math.random() * (this.cards.length - 1));
		var card = this.cards[num];
		this.cards.splice(num, 1);
		return card;
	},
	
	tradeCards: function()
	{
		//validate cards
		if(!Risk.validPair)//cards are invalid
		{
			console.error('tradeCards called without valid pair.');
			return;
		}
		//trade
		if(this.tradeCallback) this.tradeValue += this.cardValue;
		else if(this.currentPlayer.armiesLeft > 0)//player is also placing other armies
			this.currentPlayer.placeExtraArmies(this.cardValue);
		else this.currentPlayer.placeArmies(this.cardValue);
		//move traded cards back into Risk.cards array
		var remove = [];
		Risk.currentPlayer.cards.forEach(function(card, num)
		{
			card.clear();//clear all cards for rearrangement
			if(card.selected)
			{
				remove.splice(0, 0, num);
				//insert at front so the largest numbers are firsly removed in the next step
			}
		});
		remove.forEach(function(num)
		{
			Risk.cards.push(Risk.currentPlayer.cards[num]);
			Risk.currentPlayer.cards.splice(num, 1);
		});
		//rearrange
		Risk.currentPlayer.cards.forEach(function(card, num)
		{
			card.draw($('#cardsDialog .table .cell:eq(' + num + ')'));
		});
		//increase card value
		if(this.cardValue < 12) this.cardValue += 2;
		else if(this.cardValue == 12) this.cardValue = 15;
		else this.cardValue += 5;
		//finish
		$('#cardsDialog .trade').attr('class', 'trade dialogButton inactive');
		$('#cardsDialog .message').html();
		if(this.currentPlayer.cards.length <= 4)//no need for further trade
		{
			$('#cardsDialog .ok').attr('class', 'ok dialogButton active');
			if(this.tradeCallback) this.tradeCallback.call(this.currentPlayer, this.tradeValue);
		}
	},
	
	cardCb: function()
	{
		//search for selected cards
		var selectedCards = [];
		Risk.validPair = false;
		Risk.currentPlayer.cards.forEach(function(card)
		{
			if(card.selected) selectedCards.push(card);
		});
		if(selectedCards.length == 3)//find valid pair
		{
			//3 cards of same design (Infantry, Cavalry, or Artillery)
			if(selectedCards[0].type == selectedCards[1].type
				&& selectedCards[1].type == selectedCards[2].type
				&& selectedCards[2].type != 'wild')
				Risk.validPair = true;
			//Any 2 plus a "wild" card
			else if(selectedCards[0].type == 'wild'
				|| selectedCards[1].type == 'wild'
				|| selectedCards[2].type == 'wild')
				Risk.validPair = true;
			//1 each of 3 designs (Infantry + Cavalry + Artillery)
			//(MUST BE CHECKED LAST BECAUSE FIRST STATMENT WILL BE VALID FOR OTHER PAIRS TO)
			else if(selectedCards[0].type != selectedCards[1].type
				&& selectedCards[0].type != selectedCards[2].type
				&& selectedCards[0].type != 'wild')
				//card 1 is not equal to card 2 and 3 and is not a "wild" card
				if(selectedCards[1].type != selectedCards[2].type
					&& selectedCards[1].type != 'wild')
					//card 2 is not equal to card 1 and 3 and is not a "wild" card
					if(selectedCards[2].type != 'wild')
						//card 3 is not equal to card 1 and 2 and is not a "wild" card
						Risk.validPair = true;
			if(Risk.validPair)
			{
				$('#cardsDialog .message').html('Value: ' + Risk.cardValue);
				$('#cardsDialog .trade').attr('class', 'trade dialogButton active');
			}
			else
			{
				$('#cardsDialog .message').html('Invalid pair.');
				$('#cardsDialog .trade').attr('class', 'trade dialogButton inactive');
			}
		}
		else
		{
			$('#cardsDialog .message').html('Invalid pair.');
			$('#cardsDialog .trade').attr('class', 'trade dialogButton inactive');
		}
	}
};
