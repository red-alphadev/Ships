function Stars(maxAreaX, maxAreaY, maxStars)
{
    this.maxAreaX = maxAreaX;
    this.maxAreaY = maxAreaY;
    this.stars = [];

	for(var i = 0; i < maxStars; i++)
	{
		this.stars[i] = {x: Math.floor(Math.random() * this.maxAreaX), y: Math.floor(Math.random() * this.maxAreaY)};
	}

	this.reBuild = function(star)
	{
		this.maxAreaX = star.maxAreaX;
		this.maxAreaY = star.maxAreaY;
		this.stars = star.stars;
	};

    this.draw = function(c, posX, posY)
    {
        var i = 0;
        var starX, starY;
        var middleX = canvasWidth / 2;
        var middleY = canvasHeight / 2;
        var canvasPosX = 0, canvasPosY = 0, dst = Math.pow(canvasHeight, 2);

        c.strokeStyle = 'white';
        c.lineWidth = 1;

        for(i = 0; i < this.stars.length; i++)
        {
            starX = this.stars[i].x;
            starY = this.stars[i].y;

			if (Math.pow(starX - posX, 2) + Math.pow(starY - posY, 2) < dst)
			{
				if (posX > middleX && posX < this.maxAreaX - middleX && posY > middleY && posY < this.maxAreaY - middleY)
				{
					canvasPosX = starX - posX + middleX;
					canvasPosY = starY - posY + middleY;
				}
				else if (posX < middleX || posX > this.maxAreaX - middleX || posY < middleY || posY > this.maxAreaY - middleY)
				{
					if (posX < middleX)
					{
						canvasPosX = starX;
					}
					else if (posX > this.maxAreaX - middleX)
					{
						canvasPosX = canvasWidth - (this.maxAreaX - starX);
					}
					else
					{
						canvasPosX = starX - posX + middleX;
					}

					if (posY < middleY)
					{
						canvasPosY = starY;
					}
					else if (posY > this.maxAreaY - middleY)
					{
						canvasPosY = canvasHeight - (this.maxAreaY - starY);
					}
					else
					{
						canvasPosY = starY - posY + middleY;
					}
				}
			}

			canvasPosX = Math.floor(canvasPosX);
			canvasPosY = Math.floor(canvasPosY);

			if (canvasPosX && canvasPosY)
			{
				c.moveTo(canvasPosX, canvasPosY);
				c.lineTo(canvasPosX + 1, canvasPosY + 1);
			}
        }
		c.stroke();
    }
}