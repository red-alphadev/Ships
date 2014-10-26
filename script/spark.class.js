function Spark(x, y){
    this.state = 0;
    this.canvasX = x;
    this.canvasY = y;
    this.canvasTargetX = x + (-60 + Math.round(Math.random() * 120));
    this.canvasTargetY = y + (-20 + Math.round(Math.random() * 40));
    this.speed = grn(1, 10) / 5;
    this.life = 0;

    this.magnitude = Math.sqrt(Math.pow(this.canvasTargetX - this.canvasX, 2) + Math.pow(this.canvasTargetY - this.canvasY, 2));
    this.velocityX = ((this.canvasTargetX - this.canvasX) / this.magnitude) * this.speed;
    this.velocityY = ((this.canvasTargetY - this.canvasY) / this.magnitude) * this.speed;

    this.animate = function(c)
    {
		if (this.life < 30)
        {
            this.life++;

            this.canvasX += this.velocityX;
            this.canvasY += this.velocityY;

			this.canvasX = Math.floor(this.canvasX);
			this.canvasY = Math.floor(this.canvasY);

            c.strokeStyle = 'white';
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(this.canvasX, this.canvasY);
            c.lineTo(this.canvasX + grn(1, 5), this.canvasY + grn(1, 5));
            c.stroke();
        }
		else if (this.life < 40)
		{
			this.life++;

			c.strokeStyle = 'white';
			c.lineWidth = 1;

			var eta = grn(1, 3);

			c.beginPath();
			c.arc(this.canvasX, this.canvasY, eta, 0, 2 * Math.PI, true);
			c.stroke();
		}
		else
		{
			this.state = 1;
		}
    };

    this.getState = function()
    {
        return this.state;
    };
}