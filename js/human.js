function calculateNumberOfArmies(color, territories)
{
	var continentBonus = 0;
	for(var continent in WorldMap.Continents)
	{
		var captured = true;
		for(var territory in WorldMap.Continents[continent].Territories)
			if(WorldMap.Continents[continent].Territories[territory].color != color)
				captured = false;
		if(captured) continentBonus += WorldMap.Continents[continent].value;
	}
	var territoryNumber = 0;
	Map.forAllTerritories(function(territory)
	{
		if(territory.color == color) territoryNumber++;
	});
	var num = Math.floor(territoryNumber / 3) + continentBonus;
	return num > 3 ? num : 3;
};

function human(_color, _name)
{
	this.color = _color;
	this.name = _name;
	this.cards = [];
	this.invader = undefined;
	this.fortifySource = undefined;
	this.expanded = false;
	this.armiesLeft = 0;

	this.chooseTerritory = function(left, callback)
	{
		$('#messageBox').html('Choose a territory, you have ' + left + ' armies left.');
		Map.setClickCb(function(territory)
		{
			if(territory.color == '')
			{
				playClickSound();
				territory.setArmies(1);
				territory.setColor(this.color);
				territory.showCircle();
				callback();
			}
			else playErrorSound();
		}, this);
	};

	this.startRound = function(callback)
	{
		this.endRoundCb = callback;
		$('#cardsButton').removeClass('inactive').addClass('active');
		//trade cards
		if(this.cards.length >= 5)
		{
			$('#cardsDialog .ok').attr('class', 'ok dialogButton inactive');
			showDialog('#cardsDialog');
		}
		//place armies
		this.placeArmies(calculateNumberOfArmies(this.color, this.territories), function()
		{
			$('#cardsButton').removeClass('active').addClass('inactive');
			this.doAttack();//start attack cycle
		}, this);
	};

	this.placeArmies = function(armies, callback, obj)
	{
		this.armiesLeft = armies;
		$('#messageBox').html('Place armies, you have ' + this.armiesLeft + ' armies left.');
		Map.setClickCb(function(territory)
		{
			if(territory.color == this.color)
			{
				playClickSound();
				console.log()
				territory.setArmies(territory.armies + 1);
				this.armiesLeft--;
				if(this.armiesLeft > 0) $('#messageBox').html('Divide armies, you have ' + this.armiesLeft + ' armies left.');
				else callback.call(obj);
			}
			else playErrorSound();
		}, this);
	};

	this.placeExtraArmies = function(armies)
	{
		this.armiesLeft += armies;
		$('#messageBox').html('Place armies, you have ' + this.armiesLeft + ' armies left.');
	};

	this.doAttack = function()
	{
		$('#messageBox').html('Select territory to attack from.');
		$('#endButton').show();
		Map.setClickCb(function(territory)
		{
			if(territory.color == this.color)//territory is ours
			{
				if(territory.armies > 1)//territory has enough armies
				{
					playClickSound();
					$('#messageBox').html('Select a territory to attack with ' + territory.name);
					if(this.invader) this.invader.setState('normal');
					Map.forAllTerritories(function(territory)
					{
						territory.setState('inactive');
					});
					this.invader = territory;
					territory.planAttack();
				}
				else playErrorSound();
			}
			else if(territory.state == 'glow')//attack
			{
				playClickSound();
				$('#messageBox').html(this.invader.name + ' attacks ' + territory.name);
				Risk.startAttack(this.invader, territory, function(won, armiesLeft, cards)
				{
					if(won)
					{
						this.expanded = true;
						//divide left armies
						Risk.divideArmies(this.invader, territory, armiesLeft + 1,//add army left behind
						function(sourceNum, targetNum)
						{
							this.invader.setArmies(sourceNum);
							territory.setColor(this.color, true);
							territory.setArmies(targetNum);
							//handle any cards
							this.cards.concat(cards);
							if(this.cards.length >= 6)
							{
								$('#cardsDialog .ok').attr('class', 'ok dialogButton inactive');
								showDialog('#cardsDialog');
								Risk.tradedValue = 0;
								Risk.tradeCallback = function(traded)
								{
									Risk.tradeCallback = undefined;
									hideDialogs();
									placeArmies(traded, function()
									{
										playShotSound();
										this.doAttack();
									}, this);
								};
							}
							else
							{
								playShotSound();
								this.doAttack();
							}
						});
					}
					else
					{
						this.invader.setArmies(armiesLeft + 1);//1 left army + retreating armies
						this.doAttack();
					}
				});
			}
			else playErrorSound();
		}, this);
	};

	this.endRound = function()
	{
		//reset map
		Map.forAllTerritories(function(territory)
		{
			territory.setState('normal');
		});
		//finish function
		function end()
		{
			$('#skipButton').hide();
			//recieve cards
			if(this.expanded)
			{
				this.expanded = false;
				this.cards.push(Risk.recieveCard());
			}
			//end
			this.endRoundCb();
		};
		//fortifying position
		$('#messageBox').html('Fortify your position or skip this step.');
		$('#endButton').hide();
		$('#skipButton').unbind().show().click(function()
		{
			playClickSound();
			end.call(Risk.currentPlayer);
		});
		Map.setClickCb(function(territory)
		{
			if(territory.color == this.color)//territory is ours
			{
				if(territory.state == 'glow')//fortify
				{
					playClickSound();
					Risk.divideArmies(this.fortifySource, territory,
					this.fortifySource.armies + territory.armies,
					function(sourceNum, targetNum)
					{
						playClickSound();//click is not triggered by ok button
						//(if divideArmies is used after attacking a shot is already fired)
						this.fortifySource.setArmies(sourceNum);
						territory.setArmies(targetNum);
						//reset map
						Map.forAllTerritories(function(territory)
						{
							territory.setState('normal');
						});
						end.call(this);//finish
					});
				}
				else if(territory.armies > 1)//territory has enough armies to use it to fortify
				{
					playClickSound();
					if(this.fortifySource) this.invader.setState('normal');
					Map.forAllTerritories(function(territory)
					{
						territory.setState('inactive');
					});
					this.fortifySource = territory;
					territory.fortityPosition();
				}
				else playErrorSound();
			}
			else playErrorSound();
		}, this);
	};
};
