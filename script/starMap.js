function starMap(sector)
{
	this.stars = {};
	this.circleSize = 0;
	this.currentAngle = 0;
	this.currentSector = sector;

	this.loadMap = function()
	{
		var xml = new XMLHttpRequest();
		xml.open('GET', '/ships/ajax/getSectors.php', false);
		xml.send();

		this.stars = JSON.parse(xml.responseText);

		for(var i = 0; i < this.stars.length; i++)
		{
			this.stars[i].sectorX = Math.floor(this.stars[i].sectorX / 100000 * canvasWidth);
			this.stars[i].sectorY = Math.floor(this.stars[i].sectorY / 100000 * canvasHeight);
		}
	};

	this.getSelectedSector = function()
	{
		var cStar, cStarTextLength, cStarNameSizeX;

		for(var i = 0; i < this.stars.length; i++)
		{
			cStar = this.stars[i];
			cStarTextLength = cStar.sectorName.length * 9;
			cStarNameSizeX = cStar.sectorX + cStarTextLength;

			if (cStarNameSizeX < canvasWidth)
			{
				if (mouseX > cStar.sectorX && mouseX - cStar.sectorX < cStarTextLength && Math.abs(mouseY - cStar.sectorY) < 12)
				{
					return i;
				}
			}
			else
			{
				if (mouseX < cStar.sectorX && cStar.sectorX - mouseX < cStarTextLength && Math.abs(mouseY - cStar.sectorY) < 12)
				{
					return i;
				}
			}
		}

		return false;
	};

	this.draw = function(c)
	{
		var selected = this.getSelectedSector();

		for(var i = 0; i < this.stars.length; i++)
		{
			c.fillStyle = 'white';
			if (selected === i)
			{
				c.fillStyle = 'red';
			}

			if (this.stars[i].sectorX + this.stars[i].sectorName.length * 8 > canvasWidth)
			{
				c.fillText(this.stars[i].sectorName + "(" + i + ")", this.stars[i].sectorX - this.stars[i].sectorName.length * 8 - 15, this.stars[i].sectorY + 3);
			}
			else
			{
				c.fillText(this.stars[i].sectorName + "(" + i + ")", this.stars[i].sectorX + 5, this.stars[i].sectorY + 3);
			}

			c.strokeStyle = 'white';

			c.beginPath();
			c.moveTo(this.stars[i].sectorX, this.stars[i].sectorY);
			c.lineTo(this.stars[i].sectorX + 1, this.stars[i].sectorY - 1);
			c.stroke();
		}

		if ((selected !== false) && (selected != this.currentSector))
		{
			c.lineWidth = 1;
			var dX = Math.abs(this.stars[this.currentSector].sectorX - this.stars[selected].sectorX),
				dY = Math.abs(this.stars[this.currentSector].sectorY - this.stars[selected].sectorY);
				dst = Math.round(Math.sqrt(dX * dX + dY * dY));

			c.moveTo(this.stars[this.currentSector].sectorX, this.stars[this.currentSector].sectorY);
			c.lineTo(this.stars[selected].sectorX, this.stars[selected].sectorY);
			c.stroke();

			c.font = '24px Verdana';
			c.fillStyle = 'green';
			c.fillText('Distance: ' + dst, 20, canvasHeight - 20);
			c.font = '12px Verdana';
		}

		c.lineWidth = 1;
		if (selected !== false && this.circleSize < 20)
		{
			c.beginPath();
			c.arc(this.stars[selected].sectorX, this.stars[selected].sectorY, this.circleSize, this.currentAngle, this.currentAngle + 1.75 * Math.PI, false);
			c.stroke();
			this.circleSize++;
		}
		else if (selected !== false && this.circleSize >= 20)
		{
			c.beginPath();
			c.arc(this.stars[selected].sectorX, this.stars[selected].sectorY, this.circleSize, this.currentAngle, this.currentAngle + 1.75 * Math.PI, false);
			this.currentAngle += 0.03;
			this.currentAngle %= 2 * Math.PI;

			c.stroke();
		}
		else if (selected === false)
		{
			this.circleSize = 0;
			this.currentAngle = 0;
		}
	};

	this.loadMap();
}