var Map = {
	point_size: 7,
	territories: 0,
	
	setClickCb: function(callback, obj)
	{
		this.clickCb = callback;
		this.clickObj = obj;
	},
	
	territoryCb: function(territory)
	{
		if(this.clickCb) this.clickCb.call(this.clickObj, territory);
		//else playClickSound();
	},
	
	forAllTerritories: function(func, obj)
	{
		for(var continent in WorldMap.Continents)
			for(var territory in WorldMap.Continents[continent].Territories)
				func.call(obj, WorldMap.Continents[continent].Territories[territory], WorldMap.Continents[continent]);
	},
	
	connect: function(a, b)
	{
		a.addBorder(b);
		b.addBorder(a);
	},
	
	setup: function(_r)
	{
		this.r = _r;
		this.scope = this;
		this.mapGroup = this.r.group();
		//load all territories
		this.forAllTerritories(function(territory, continent)
		{
			territory.draw(this.r, continent.color, WorldMap.texture, WorldMap.opacity);
			territory.onClick(this.territoryCb, this);
			this.mapGroup.push(territory.surface);
			this.territories++;
		}, this);
		//connect all territories
		this.connect(WorldMap.Continents.North_America.Territories.Alaska,
					 WorldMap.Continents.Asia.Territories.Kamchatka);
		this.connect(WorldMap.Continents.North_America.Territories.Alaska,
					 WorldMap.Continents.North_America.Territories.Northwest_Territory);
		this.connect(WorldMap.Continents.North_America.Territories.Alaska,
					 WorldMap.Continents.North_America.Territories.Alberta);
		this.connect(WorldMap.Continents.North_America.Territories.Northwest_Territory,
					 WorldMap.Continents.North_America.Territories.Alberta);
		this.connect(WorldMap.Continents.North_America.Territories.Northwest_Territory,
					 WorldMap.Continents.North_America.Territories.Greenland);
		this.connect(WorldMap.Continents.North_America.Territories.Northwest_Territory,
					 WorldMap.Continents.North_America.Territories.Ontario);
		this.connect(WorldMap.Continents.North_America.Territories.Alberta,
					 WorldMap.Continents.North_America.Territories.Ontario);
		this.connect(WorldMap.Continents.North_America.Territories.Ontario,
					 WorldMap.Continents.North_America.Territories.Quebec);
		this.connect(WorldMap.Continents.North_America.Territories.Ontario,
					 WorldMap.Continents.North_America.Territories.Greenland);
		this.connect(WorldMap.Continents.North_America.Territories.Quebec,
					 WorldMap.Continents.North_America.Territories.Greenland);
		this.connect(WorldMap.Continents.North_America.Territories.Western_United_States,
					 WorldMap.Continents.North_America.Territories.Alberta);
		this.connect(WorldMap.Continents.North_America.Territories.Western_United_States,
					 WorldMap.Continents.North_America.Territories.Ontario);
		this.connect(WorldMap.Continents.North_America.Territories.Eastern_United_States,
					 WorldMap.Continents.North_America.Territories.Ontario);
		this.connect(WorldMap.Continents.North_America.Territories.Eastern_United_States,
					 WorldMap.Continents.North_America.Territories.Quebec);
		/*this.connect(WorldMap.Continents.North_America.Territories.Western_United_States,
					 WorldMap.Continents.North_America.Territories.Hawaii);
		this.connect(WorldMap.Continents.North_America.Territories.Hawaii,
					 WorldMap.Continents.Asia.Territories.Japan);*/
		this.connect(WorldMap.Continents.North_America.Territories.Western_United_States,
					 WorldMap.Continents.North_America.Territories.Central_America);
		this.connect(WorldMap.Continents.North_America.Territories.Eastern_United_States,
					 WorldMap.Continents.North_America.Territories.Western_United_States);
		this.connect(WorldMap.Continents.North_America.Territories.Eastern_United_States,
					 WorldMap.Continents.North_America.Territories.Central_America);
		this.connect(WorldMap.Continents.North_America.Territories.Central_America,
					 WorldMap.Continents.South_America.Territories.Venezuela);
		this.connect(WorldMap.Continents.South_America.Territories.Venezuela,
					 WorldMap.Continents.South_America.Territories.Peru);
		this.connect(WorldMap.Continents.South_America.Territories.Venezuela,
					 WorldMap.Continents.South_America.Territories.Brazil);
		this.connect(WorldMap.Continents.South_America.Territories.Peru,
					 WorldMap.Continents.South_America.Territories.Brazil);
		this.connect(WorldMap.Continents.South_America.Territories.Peru,
					 WorldMap.Continents.South_America.Territories.Argentina);
		this.connect(WorldMap.Continents.South_America.Territories.Brazil,
					 WorldMap.Continents.South_America.Territories.Argentina);
		this.connect(WorldMap.Continents.South_America.Territories.Brazil,
					 WorldMap.Continents.Africa.Territories.North_Africa);
		this.connect(WorldMap.Continents.Africa.Territories.North_Africa,
					 WorldMap.Continents.Africa.Territories.Congo);
		this.connect(WorldMap.Continents.Africa.Territories.North_Africa,
					 WorldMap.Continents.Africa.Territories.East_Africa);
		this.connect(WorldMap.Continents.Africa.Territories.North_Africa,
					 WorldMap.Continents.Africa.Territories.Egypt);
		this.connect(WorldMap.Continents.Africa.Territories.North_Africa,
					 WorldMap.Continents.Europe.Territories.Western_Europe);
		this.connect(WorldMap.Continents.Africa.Territories.North_Africa,
					 WorldMap.Continents.Europe.Territories.Southern_Europe);
		this.connect(WorldMap.Continents.Africa.Territories.Congo,
					 WorldMap.Continents.Africa.Territories.South_Africa);
		this.connect(WorldMap.Continents.Africa.Territories.Congo,
					 WorldMap.Continents.Africa.Territories.East_Africa);
		this.connect(WorldMap.Continents.Africa.Territories.South_Africa,
					 WorldMap.Continents.Africa.Territories.Madagascar);
		this.connect(WorldMap.Continents.Africa.Territories.South_Africa,
					 WorldMap.Continents.Africa.Territories.East_Africa);
		this.connect(WorldMap.Continents.Africa.Territories.East_Africa,
					 WorldMap.Continents.Africa.Territories.Madagascar);
		this.connect(WorldMap.Continents.Africa.Territories.East_Africa,
					 WorldMap.Continents.Africa.Territories.Egypt);
		this.connect(WorldMap.Continents.Africa.Territories.East_Africa,
					 WorldMap.Continents.Asia.Territories.Middle_East);
		this.connect(WorldMap.Continents.Africa.Territories.Egypt,
					 WorldMap.Continents.Asia.Territories.Middle_East);
		this.connect(WorldMap.Continents.Africa.Territories.Egypt,
					 WorldMap.Continents.Europe.Territories.Southern_Europe);
		this.connect(WorldMap.Continents.Europe.Territories.Southern_Europe,
					 WorldMap.Continents.Europe.Territories.Western_Europe);
		this.connect(WorldMap.Continents.Europe.Territories.Southern_Europe,
					 WorldMap.Continents.Europe.Territories.Northern_Europe);
		this.connect(WorldMap.Continents.Europe.Territories.Southern_Europe,
					 WorldMap.Continents.Europe.Territories.Ukraine);
		this.connect(WorldMap.Continents.Europe.Territories.Northern_Europe,
					 WorldMap.Continents.Europe.Territories.Ukraine);
		this.connect(WorldMap.Continents.Europe.Territories.Northern_Europe,
					 WorldMap.Continents.Europe.Territories.Western_Europe);
		this.connect(WorldMap.Continents.Europe.Territories.Northern_Europe,
					 WorldMap.Continents.Europe.Territories.Scandinavia);
		this.connect(WorldMap.Continents.Europe.Territories.Scandinavia,
					 WorldMap.Continents.Europe.Territories.Great_Britain);
		this.connect(WorldMap.Continents.Europe.Territories.Scandinavia,
					 WorldMap.Continents.Europe.Territories.Iceland);
		this.connect(WorldMap.Continents.Europe.Territories.Scandinavia,
					 WorldMap.Continents.Europe.Territories.Ukraine);
		this.connect(WorldMap.Continents.Europe.Territories.Northern_Europe,
					 WorldMap.Continents.Europe.Territories.Great_Britain);
		this.connect(WorldMap.Continents.Europe.Territories.Great_Britain,
					 WorldMap.Continents.Europe.Territories.Western_Europe);
		this.connect(WorldMap.Continents.Europe.Territories.Great_Britain,
					 WorldMap.Continents.Europe.Territories.Iceland);
		this.connect(WorldMap.Continents.Europe.Territories.Iceland,
					 WorldMap.Continents.North_America.Territories.Greenland);
		this.connect(WorldMap.Continents.Europe.Territories.Ukraine,
					 WorldMap.Continents.Asia.Territories.Ural);
		this.connect(WorldMap.Continents.Europe.Territories.Ukraine,
					 WorldMap.Continents.Asia.Territories.Afghanistan);
		this.connect(WorldMap.Continents.Europe.Territories.Ukraine,
					 WorldMap.Continents.Asia.Territories.Middle_East);
		this.connect(WorldMap.Continents.Asia.Territories.Ural,
					 WorldMap.Continents.Asia.Territories.Siberia);
		this.connect(WorldMap.Continents.Asia.Territories.Ural,
					 WorldMap.Continents.Asia.Territories.Afghanistan);
		this.connect(WorldMap.Continents.Asia.Territories.Afghanistan,
					 WorldMap.Continents.Asia.Territories.Middle_East);
		this.connect(WorldMap.Continents.Asia.Territories.Afghanistan,
					 WorldMap.Continents.Asia.Territories.India);
		this.connect(WorldMap.Continents.Asia.Territories.Afghanistan,
					 WorldMap.Continents.Asia.Territories.China);
		this.connect(WorldMap.Continents.Asia.Territories.India,
					 WorldMap.Continents.Asia.Territories.Middle_East);
		this.connect(WorldMap.Continents.Asia.Territories.India,
					 WorldMap.Continents.Asia.Territories.China);
		this.connect(WorldMap.Continents.Asia.Territories.India,
					 WorldMap.Continents.Asia.Territories.Siam);
		this.connect(WorldMap.Continents.Asia.Territories.China,
					 WorldMap.Continents.Asia.Territories.Siam);
		this.connect(WorldMap.Continents.Asia.Territories.China,
					 WorldMap.Continents.Asia.Territories.Mongolia);
		this.connect(WorldMap.Continents.Asia.Territories.China,
					 WorldMap.Continents.Asia.Territories.Siberia);
		this.connect(WorldMap.Continents.Asia.Territories.China,
					 WorldMap.Continents.Asia.Territories.Ural);
		this.connect(WorldMap.Continents.Asia.Territories.Mongolia,
					 WorldMap.Continents.Asia.Territories.Japan);
		this.connect(WorldMap.Continents.Asia.Territories.Mongolia,
					 WorldMap.Continents.Asia.Territories.Kamchatka);
		this.connect(WorldMap.Continents.Asia.Territories.Mongolia,
					 WorldMap.Continents.Asia.Territories.Irkutsk);
		this.connect(WorldMap.Continents.Asia.Territories.Mongolia,
					 WorldMap.Continents.Asia.Territories.Siberia);
		this.connect(WorldMap.Continents.Asia.Territories.Irkutsk,
					 WorldMap.Continents.Asia.Territories.Siberia);
		this.connect(WorldMap.Continents.Asia.Territories.Irkutsk,
					 WorldMap.Continents.Asia.Territories.Yakutsk);
		this.connect(WorldMap.Continents.Asia.Territories.Irkutsk,
					 WorldMap.Continents.Asia.Territories.Kamchatka);
		this.connect(WorldMap.Continents.Asia.Territories.Yakutsk,
					 WorldMap.Continents.Asia.Territories.Siberia);
		this.connect(WorldMap.Continents.Asia.Territories.Yakutsk,
					 WorldMap.Continents.Asia.Territories.Kamchatka);
		this.connect(WorldMap.Continents.Asia.Territories.Kamchatka,
					 WorldMap.Continents.Asia.Territories.Japan);
		this.connect(WorldMap.Continents.Asia.Territories.Siam,
					 WorldMap.Continents.Australia.Territories.Indonesia);
		/*this.connect(WorldMap.Continents.Australia.Territories.Indonesia,
					 WorldMap.Continents.Australia.Territories.Philippines);
		this.connect(WorldMap.Continents.Australia.Territories.Philippines,
					 WorldMap.Continents.Asia.Territories.Japan);*/
		this.connect(WorldMap.Continents.Australia.Territories.Indonesia,
					 WorldMap.Continents.Australia.Territories.New_Guinea);
		this.connect(WorldMap.Continents.Australia.Territories.Indonesia,
					 WorldMap.Continents.Australia.Territories.Western_Australia);
		this.connect(WorldMap.Continents.Australia.Territories.Western_Australia,
					 WorldMap.Continents.Australia.Territories.New_Guinea);
		this.connect(WorldMap.Continents.Australia.Territories.Western_Australia,
					 WorldMap.Continents.Australia.Territories.Eastern_Australia);
		this.connect(WorldMap.Continents.Australia.Territories.Eastern_Australia,
					 WorldMap.Continents.Australia.Territories.New_Guinea);
		/*this.connect(WorldMap.Continents.Australia.Territories.Eastern_Australia,
					 WorldMap.Continents.Australia.Territories.New_Zealand);
		this.connect(WorldMap.Continents.Australia.Territories.New_Zealand,
					 WorldMap.Continents.South_America.Territories.Argentina);*/
	},
	
	clear: function()
	{
		Risk.attackControls.hide();
		this.forAllTerritories(function(territory)
		{
			territory.hideCircle();
			territory.setState('normal');
			territory.color = '';
		});
	}
};
