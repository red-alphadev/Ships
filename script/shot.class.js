function Shot(areaX, areaY, posX, posY, toX, toY, power, speed, mod, color)
{
    this.AreaX = areaX;
    this.AreaY = areaY;
	this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.power = power;
    this.speed = speed;
    this.modulation = mod;
	this.life = 0;

    this.magnitude = Math.sqrt(Math.pow(toX - posX, 2) + Math.pow(toY - posY, 2));
    this.velocityX = ((toX - posX) / this.magnitude) * this.speed;
    this.velocityY = ((toY - posY) / this.magnitude) * this.speed;

    this.move = function(c, x, y)
    {
        this.AreaX += this.velocityX;
        this.AreaY += this.velocityY;

        this.draw(c, x, y);
    };

    this.draw = function(c, x, y)
    {
        c.strokeStyle = this.color;
        c.lineWidth = 2;
		c.lineCap = 'round';
        c.beginPath();
        c.moveTo(this.AreaX - x, this.AreaY - y);
        c.lineTo(this.AreaX - x - this.velocityX, this.AreaY - y - this.velocityY);
        c.stroke();

		this.life++;
    };

    this.getX = function()
    {
        return this.posX;
    };

    this.getY = function()
    {
        return this.posY;
    };

    this.hit = function(x, y, rad)
    {
        return Math.pow(x - this.AreaX, 2) + Math.pow(y - this.AreaY, 2) < Math.pow(rad, 2);
    };

    this.getPower = function()
    {
        return this.power;
    };

    this.getModulation = function()
    {
        return this.modulation;
    };

    this.isOutofBounds = function()
    {
		return this.life > 60;
    };

	this.getShotType = function()
	{
		return 1;
	};
}