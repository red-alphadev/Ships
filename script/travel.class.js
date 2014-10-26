function Travel()
{
	this.Points = [];
	this.EndPoints = [];
	this.life = 0;
	this.direction = 0;

	for(var i = 0; i < 50; i++)
	{
		this.Points[i] = {x: grn(0, canvasWidth), y: grn(0, canvasHeight)};
	}

	this.draw = function(c)
	{
		if (this.life > 72) return false;

		c.fillStyle = 'black';
		c.strokeStyle = 'white';
		c.fillRect(0, 0, canvasWidth, canvasHeight);

		for (var i = 0; i < this.Points.length; i++)
		{
			c.beginPath();
			c.moveTo(this.Points[i].x, this.Points[i].y);
			c.lineTo(this.Points[i].x - 0.8 * this.life, this.Points[i].y);
			c.closePath();
			c.stroke();

			this.Points[i].x -= this.life;

			if (this.Points[i].x < 0.8 * this.life)
			{
				this.Points[i] = {x: grn(canvasWidth - 100, canvasWidth), y: grn(0, canvasHeight)};
			}
		}

		if (this.life < 34 && this.direction == 0)
		{
			this.life++;
		}
		else if (this.direction == 0)
		{
			this.direction = 1;
		}
		else
		{
			this.life--;
		}

		return true;
	};

	this.isDone = function()
	{
		return this.life == -1;
	};
}