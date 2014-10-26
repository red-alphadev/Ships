function Shield(x, y, str, mod, rechargeRate)
{
    this.frames = 0;
    this.posX = x;
    this.posY = y;
    this.strength = str;
    this.maxStrength = str;
	this.shieldColorUnit = 255 / str;
    this.radius = 25;
    this.shieldColor = 255;
	this.rechargeRate = rechargeRate;
    this.modulation = mod;

    this.incrementFrames = function()
    {
        if (this.frames == this.rechargeRate)
        {
            this.frames = 0;
            return true;
        }
        else
        {
            this.frames++;
        }

        return false;
    };

    this.draw = function(c, x, y)
    {
        this.posX = x;
        this.posY = y;

		if (this.incrementFrames())
		{
			this.setStrength(1);
		}

		if (this.strength > 0)
		{
//			c.fillStyle = 'rgba(0, 0, ' + this.shieldColor + ', 1)';
			c.beginPath();
			c.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);

			c.lineWidth = 5;
			c.strokeStyle = 'rgba(0, 0, ' + this.shieldColor.toString() + ', 1)';
			c.stroke();
			c.closePath();
		}
    };

    this.getShield = function()
    {
        return this.strength;
    };

    this.setStrength = function(byAmount)
    {
        if (this.strength + byAmount <= this.maxStrength && this.strength + byAmount >= 0)
        {
            this.strength += byAmount;
            this.shieldColor = Math.floor(this.strength * this.shieldColorUnit);
        }
    };

    this.getRadius = function()
    {
        return this.radius;
    };

    this.getModulation = function()
    {
        return this.modulation;
    };

    this.increaseModulation = function()
    {
        if (this.modulation < 9)
        {
            this.modulation++;
        }
    };

    this.setModulation = function(value)
    {
        if (this.modulation <= 9 && this.modulation >= 0)
        {
            this.modulation += value;
        }
    };

    this.decreaseModulation = function()
    {
        if (this.modulation > 0)
        {
            this.modulation--;
        }
    };

	this.setRechargeRate = function(rate)
	{
		this.rechargeRate = rate;
	};

	this.setShieldStrength = function(strength)
	{
		this.strength = strength;
		this.maxStrength = strength;
	}
}