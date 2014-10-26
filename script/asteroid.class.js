function Asteroid(posX, posY, type)
{
    this.rotationAngle = Math.random() * 0.01;
    this.AreaPosX = posX;
    this.AreaPosY = posY;
    this.CanvasPosX = 0;
    this.CanvasPosY = 0;
    this.Vertices = [];
    this.resource = type;
    this.unitWeight = 0;
    this.amount = 0;
    this.radius = 0;

	this.reBuild = function(astro)
	{
		this.rotationAngle = astro.rotationAngle;
		this.AreaPosX = astro.AreaPosX;
		this.AreaPosY = astro.AreaPosY;
		this.CanvasPosX = astro.CanvasPosX;
		this.CanvasPosY = astro.CanvasPosY;
		this.Vertices = astro.Vertices;
		this.resource = astro.resource;
		this.unitWeight = astro.unitWeight;
		this.amount = astro.amount;
		this.radius = astro.radius;
	};

    this.createVertices = function()
    {
        var numberOfVertices = 6, i;
        var angle = Math.random() * Math.PI * 2 / (numberOfVertices - 2);
        this.radius = Math.floor(30 + Math.random() * 70);

        this.Vertices = [];
        i = 0;
        do
        {
            if (angle < Math.PI * 2)
            {
                this.Vertices[2 * i] = Math.round(Math.cos(angle) * this.radius);
                this.Vertices[2 * i + 1] = Math.round(Math.sin(angle) * this.radius);
                i++;
            }

            angle += Math.random() * Math.PI * 2 / (numberOfVertices - 2);
        }
        while(angle < Math.PI * 2);

        this.amount = this.radius * 100;

        this.unitWeight = itemWeights[this.resource];
    };

	this.getVertices = function()
	{
		return this.Vertices;
	};

	this.isCloseToAsteroid = function(asteroid)
	{
		return Math.pow(asteroid.AreaPosX - this.AreaPosX, 2) + Math.pow(asteroid.AreaPosY - this.AreaPosY, 2) < Math.pow(asteroid.radius + this.radius + 75, 2);
	};

    this.draw = function(c, shipX, shipY)
    {
        var i, verticesLength = this.Vertices.length / 2;

        for (i = 0; i < verticesLength; i++)
        {
            var x = this.Vertices[2*i];
            this.Vertices[2*i]  = this.Vertices[2*i] * Math.cos(this.rotationAngle) + this.Vertices[2*i + 1] * Math.sin(this.rotationAngle);
            this.Vertices[2*i+1]  = this.Vertices[2*i + 1] * Math.cos(this.rotationAngle) - x * Math.sin(this.rotationAngle);
        }

        if ((shipX > canvasWidth / 2) && (shipX < mapSize - canvasWidth / 2))
        {
            this.CanvasPosX = this.AreaPosX - shipX + canvasWidth / 2;
        }
        else if (shipX < canvasWidth / 2)
        {
            this.CanvasPosX = this.AreaPosX;
        }
        else
        {
            this.CanvasPosX = canvasWidth - (mapSize - this.AreaPosX);
        }

        if (shipY > canvasHeight / 2 && shipY < mapSize - canvasHeight / 2)
        {
            this.CanvasPosY = this.AreaPosY - shipY + canvasHeight / 2;
        }
        else if (shipY < canvasHeight / 2)
        {
            this.CanvasPosY = this.AreaPosY;
        }
        else
        {
            this.CanvasPosY = canvasHeight - (mapSize - this.AreaPosY);
        }

        c.strokeStyle = 'white';
        c.lineWidth = 1;
        c.beginPath();

        for (i = 0; i < verticesLength; i++)
        {
            if (i == 0)
            {
                c.moveTo(this.Vertices[0] + this.CanvasPosX, this.Vertices[1] + this.CanvasPosY);
            }
            else
            {
                c.lineTo(this.Vertices[2*i] + this.CanvasPosX, this.Vertices[2*i+1] + this.CanvasPosY);
            }
        }

        c.closePath();
        c.stroke();

        c.font = '12px Verdana';
        c.fillStyle = 'magenta';
        c.fillText('Amount: ' + this.amount, this.CanvasPosX - 50, this.CanvasPosY + 20);
        c.fillText('Type: ' + itemNames[this.resource], this.CanvasPosX - 50, this.CanvasPosY);
    };

    this.isCloseTo = function(x, y)
    {
        return Math.pow(x - this.AreaPosX, 2) + Math.pow(y - this.AreaPosY, 2) < Math.pow(canvasWidth, 2);
    };

    this.isHitByPoint = function(x, y)
    {
        var nvert = this.Vertices.length / 2;
        var i, j, c = false, vertx = [], verty = [];

        for(i = 0; i < nvert; i++)
        {
            vertx[i] = this.Vertices[2*i] + this.CanvasPosX;
            verty[i] = this.Vertices[2*i + 1] + this.CanvasPosY;
        }

        for (i = 0, j = nvert - 1; i < nvert; j = i++)
        {
            if ( ((verty[i] > y) != (verty[j] > y)) &&
                 (x < (vertx[j] - vertx[i]) * (y - verty[i]) / (verty[j] - verty[i]) + vertx[i])
                )
                c = !c;
        }

        return c;
    };

    this.getType = function()
    {
        return this.resource;
    };

    this.mineAmount = function(power)
    {
        power /= 10;
        var powerInt = Math.floor(power);
        var powerDecimal = power - powerInt;
        var rnd = 0;

        if (powerDecimal != 0)
        {
            rnd = Math.random();

            if (rnd < powerDecimal)
            {
                powerInt++;
            }
        }

        return powerInt;
    };

    this.getWeight = function()
    {
        return this.unitWeight;
    };

    this.removeAmount = function(amount)
    {
        this.amount -= amount;
    };
}