var territoryCircleRadius = [10, 14, 18];

function getRadius(armies)
{
	if(armies < 100) return territoryCircleRadius[0];
	else if(armies < 1000) return territoryCircleRadius[1];
	else return territoryCircleRadius[2];
};

function over()
{
	window.document.title = this.scope.name;
	this.scope.toFront();
	this.scope.face.stop().animate({ 'stroke': '#fff', 'stroke-width': 2.0 }, 200);
};

function out()
{
	window.document.title = 'Risk';
	if(this.scope.state == 'shine') return;
 	this.scope.face.stop().animate({ 'stroke': '#000', 'stroke-width': 0.5 }, 600);
};

function click(e)
{
	if(this.scope.clickCb)
		this.scope.clickCb.call(this.scope.clickObj, this.scope);
}

function territory(_name, _path, _cx, _cy, _border)
{
    this.name = _name;
    this.path =  _path;
    this.armies = 0;
    this.borders = [];
    this.color = '';
    this.cx = _cx;
    this.cy = _cy;
    this.border = _border || 0;
    this.radius = territoryCircleRadius[0]
    this.state = 'normal';
};

territory.prototype.toFront = function()
{
	this.surface.toFront();
};

territory.prototype.draw = function(r, _fillColor, texture, opacity)
{
	this.fillColor = _fillColor;
	this.face = r.path(this.path).attr({
		'fill': this.fillColor,
		'stroke-width': 0.5,
		'fill-opacity': opacity
	});
	this.tex = r.path(this.path).attr({
		'fill': texture,
		'stroke-width': 0
	});
	this.border = r.path(this.path).attr({
		'fill-opacity': 0.0,
		'stroke-width': this.border,
		'stroke-opacity': 0.0,
	});
	var bbox = this.face.getBBox();
	this.cx = this.cx || bbox.x + bbox.width / 2;
	this.cy = this.cy || bbox.y + bbox.height / 2;
	this.circle = r.circle(this.cx, this.cy, this.radius).attr({
		'fill': '#ffffff'
	});
	this.text = r.text(this.cx, this.cy, this.armies);
	this.face.scope = this;
	this.tex.scope = this;
	this.border.scope = this;
	this.circle.scope = this;
	this.text.scope = this;
	this.surface = r.set().push(this.face, this.tex, this.border, this.circle, this.text);
	this.surface.hover(over, out);
	this.surface.mouseup(click);
	this.hideCircle();
};

territory.prototype.hideCircle = function()
{
	this.circle.hide();
	this.text.hide();
};

territory.prototype.showCircle = function()
{
	this.circle.show();
	this.text.show();
};

territory.prototype.onClick = function(callback, obj)
{
	this.clickCb = callback;
	this.clickObj = obj;
};

territory.prototype.addBorder = function(country_ptr)
{
	this.borders.push(country_ptr);
};

territory.prototype.setColor = function(_color, animate)
{
	this.color = _color;
	if(animate) this.circle.stop().animate({ 'fill': _color }, 200);
	else this.circle.attr('fill', _color);
};

territory.prototype.setArmies = function(_armies)
{
	this.armies = _armies;
	this.text.attr({ text: this.armies });
	this.radius = getRadius(this.armies);
	this.circle.attr('r',  this.radius);
};

territory.prototype.setState = function(_state)
{
	this.state = _state;
	if(_state == 'inactive') this.face.attr('fill', darkerColor(this.fillColor, 0.7));//darker
	else if(_state == 'normal') this.face.attr('fill', this.fillColor);//normal
	else if(_state == 'glow') this.face.attr('fill', lighterColor(this.fillColor, 0.1));//little lighter
	else if(_state == 'shine') this.face.attr('fill', lighterColor(this.fillColor, 0.5));//lighter
	if(_state == 'shine') this.face.attr({ 'stroke': '#fff', 'stroke-width': 2.0 });
	else this.face.attr({ 'stroke': '#000', 'stroke-width': 0.5 });
	//mouse is never on surface if shine is removed so there are no hover complications
};

territory.prototype.planAttack = function()
{
	this.setState('shine');
	for(var num = 0; num < this.borders.length; num++)
		if(this.borders[num].color != this.color)
			this.borders[num].setState('glow');
}

territory.prototype.fortityPosition = function()
{
	this.setState('shine');
	for(var num = 0; num < this.borders.length; num++)
		if(this.borders[num].color == this.color)
			this.borders[num].setState('glow');
}
