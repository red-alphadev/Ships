function Item(id, quantity){
    this.id = id;
    this.name = itemNames[id];
    this.quantity = quantity;
    this.weight = itemWeights[id];
    this.itemPrice = itemMediumPrices[id];
    this.canSell = false;
    this.canBuy = false;

	if (id > 100 && id < 111)
	{
		this.isLaser = true;
		this.laserMinDamange = id - 100;
		this.laserMaxDamange = id - 90;
		this.fireRate = Math.floor(250 - ((id - 101) * 20));
	}
	else
	{
		this.isLaser = false;
		this.laserMinDamange = 0;
		this.laserMaxDamange = 0;
		this.fireRate = 1000;
	}

	if (id > 200 && id < 211)
	{
		this.isMiningLaser = true;
		this.miningPower = id - 200;
	}
	else
	{
		this.isMiningLaser = false;
		this.miningPower = 0;
	}

	if (id > 300 && id < 311)
	{
		this.isShield = true;
		this.shieldStrength = (id - 300) * 100;
	}
	else
	{
		this.isShield = false;
		this.shieldStrength = 0;
	}

	this.reBuild = function(it)
	{
		this.id = it.id;
		this.name = it.name;
		this.quantity = it.quantity;
		this.weight = it.weight;
		this.itemPrice = it.itemPrice;
		this.canSell = it.canSell;
		this.canBuy = it.canBuy;
		this.isLaser = it.isLaser;
		this.laserMinDamange = it.laserMinDamange;
		this.laserMaxDamange = it.laserMaxDamange;
		this.fireRate = it.fireRate;
		this.isMiningLaser = it.isMiningLaser;
		this.miningPower = it.miningPower;
		this.isShield = it.isShield;
		this.shieldStrength = it.shieldStrength;
	};

    this.setCanSell = function(state)
    {
        this.canSell = state;
    };

    this.setCanBuy = function(state)
    {
        this.canBuy = state;
    };

    this.canBeSold = function()
    {
        return this.canSell;
    };

    this.canBeBought = function()
    {
        return this.canBuy;
    };

    this.setItemPrice = function(price)
    {
        this.itemPrice = price;
    };

    this.getItemPrice = function()
    {
        return this.itemPrice;
    };

    this.addItem = function(quantity)
    {
        this.quantity += quantity;
    };

    this.removeItem = function(quantity)
    {
        if (this.quantity >= quantity)
        {
            this.quantity -= quantity;
        }
    };

    this.getItemId = function()
    {
        return this.id;
    };

    this.getItemWeight = function()
    {
        return this.weight;
    };

    this.getFullStackWeight = function()
    {
        return this.weight * this.quantity;
    };

    this.getItemQuantity = function()
    {
        return this.quantity;
    };

    this.getItemName = function()
    {
        return this.name;
    };

	this.getMiningLaserPower = function()
	{
		return this.miningPower;
	};

	this.getMinLaserDamange = function()
	{
		return this.laserMinDamange;
	};

	this.getMaxLaserDamange = function()
	{
		return this.laserMaxDamange;
	};

	this.getShieldStrength = function()
	{
		return this.shieldStrength;
	};
}