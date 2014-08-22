/* Risk Card
 _______________ __
|               |
|               | 20px
|               |__
|               |
|               |
|               | 70px
|               |
|               |__
|               |
|               | 60px
|_______________|__
|     100px     |

*/

function card(_type, _cardCb, _name, _path, _color)
{
	this.name = _name;
	this.path = _path;
	this.color = _color;
	this.type = _type;
	this.cardCb = _cardCb;
	this.selected = false;
	this.div = undefined;
};

card.prototype.draw = function(div)
{
	if(this.div) return;
	this.div = div;
	this.div.get(0).scope = this;
	this.div.unbind().click(function()
	{
        $(this).toggleClass('selected');
        this.scope.selected = $(this).hasClass('selected');
        this.scope.cardCb();
    });
	div.addClass('visible');
	if(this.type == 'wild') div.append("<img class='wild' src='img/wild.png'/>");
	else
	{
		div.append("<span class='name'>" + this.name + '</span>');
		div.append("<div class='territory'></span>");
		div.append("<img class='type' src='img/" + this.type + ".png'/>");
		this.paper = new Raphael(div.find('.territory').get(0), '100%', '100%');
		this.territory = this.paper.path(this.path).attr({
			'fill': this.color,
			'fill-opacity': 0.5,
			'stroke-width': 0
		});
		var bbox = this.territory.getBBox();
		var ratio = 90 / 65;
		var tRatio = bbox.width / bbox.height;
		var bx, by, bw, bh;
		if(tRatio < ratio)//portrait
		{
			bh = bbox.height;
			bw = bh * ratio;
			by = bbox.y;
			bx = bbox.x - (bw - bbox.width) / 2;
		}
		else//landscape
		{
			bw = bbox.width;
			bh = bw / ratio;
			bx = bbox.x;
			by = bbox.y - (bh - bbox.height) / 2;
		}
		this.paper.setViewBox(bx, by, bw, bh);
	}
};

card.prototype.clear = function()
{
	if(this.div) this.div.html('').attr('class', 'cell card');
	this.div = undefined;
};

