function Pulse(posX, posY, x, y, power, color, type)
{
    this.posX = posX;
    this.posY = posY;

    this.toX = x;
    this.toY = y;

    this.color = color;
    this.power = power;
    this.pulseMaxLength = 200;
    this.pulseLength = 200;
    this.life = 0;

	this.type = type;

	this.sameSign = function(a, b)
	{
		return a * b >= 0;
	};

    this.draw = function(c, closeAsteroid)
    {
		var vertices = closeAsteroid.getVertices(), vertLen = vertices.length;
		var x = 0, y = 0;

		//determine which line is closer
		//with that line, find the point of intersection;
		//draw a 'pulse' between ship coords and that point.

//		for(var i = 0; i <= vertLen / 2 - 1; i++)
//		{
//			var ax, ay, bx, by;
//			if (i == vertLen / 2 - 1 )
//			{
//				ax = vertices[2*i];
//				ay = vertices[2*i + 1];
//				bx = vertices[0];
//				by = vertices[1];
//			}
//			else
//			{
//				ax = vertices[2*i];
//				ay = vertices[2*i + 1];
//				bx = vertices[2*(i+1)];
//				by = vertices[2*(i+1) + 1];
//			}
//
//			var r_numerator = (cx-ax)*(bx-ax) + (cy-ay)*(by-ay);
//			var r_denomenator = (bx-ax)*(bx-ax) + (by-ay)*(by-ay);
//			var r = r_numerator / r_denomenator;
//			var px = ax + r*(bx-ax);
//			var py = ay + r*(by-ay);
//			var s = ((ay-cy)*(bx-ax)-(ax-cx)*(by-ay) ) / r_denomenator;
//
//			var distanceLine = Math.abs(s)*Math.sqrt(r_denomenator);
//
//			if (distanceLine < distance)
//			{
//				closestVert = i;
//				distance = distanceLine;
//			}
//		}

		for(var i = 0; i <= vertLen / 2 - 1; i++)
		{
			var x1 = this.posX, x2 = mouseX, x3, x4, y1 = this.posY, y2 = mouseY, y3, y4;

			if (i == vertLen / 2 - 1 )
			{
				x3 = vertices[2*i];
				y3 = vertices[2*i + 1];

				x4 = vertices[0];
				y4 = vertices[1];
			}
			else
			{
				x3 = vertices[2*i];
				y3 = vertices[2*i + 1];

				x4 = vertices[2*(i+1)];
				y4 = vertices[2*(i+1) + 1];

			}
			var a1, a2, b1, b2, c1, c2;
			var r1, r2 , r3, r4;
			var denom, offset, num;

			// Compute a1, b1, c1, where line joining points 1 and 2
			// is "a1 x + b1 y + c1 = 0".
			a1 = y2 - y1;
			b1 = x1 - x2;
			c1 = (x2 * y1) - (x1 * y2);

			// Compute r3 and r4.
			r3 = ((a1 * x3) + (b1 * y3) + c1);
			r4 = ((a1 * x4) + (b1 * y4) + c1);

			// Check signs of r3 and r4. If both point 3 and point 4 lie on
			// same side of line 1, the line segments do not intersect.
			if ((r3 != 0) && (r4 != 0) && this.sameSign(r3, r4)){
				continue;
			}

			// Compute a2, b2, c2
			a2 = y4 - y3;
			b2 = x3 - x4;
			c2 = (x4 * y3) - (x3 * y4);

			// Compute r1 and r2
			r1 = (a2 * x1) + (b2 * y1) + c2;
			r2 = (a2 * x2) + (b2 * y2) + c2;

			// Check signs of r1 and r2. If both point 1 and point 2 lie
			// on same side of second line segment, the line segments do
			// not intersect.
			if ((r1 != 0) && (r2 != 0) && (this.sameSign(r1, r2))){
				continue;
			}

			//Line segments intersect: compute intersection point.
			denom = (a1 * b2) - (a2 * b1);

			if (denom == 0) {
				continue;
			}

			if (denom < 0){
			offset = -denom / 2;
			}
			else {
			offset = denom / 2 ;
			}

			// The denom/2 is to get rounding instead of truncating. It
			// is added or subtracted to the numerator, depending upon the
			// sign of the numerator.
			num = (b1 * c2) - (b2 * c1);
			if (num < 0){
			x = (num - offset) / denom;
			}
			else {
			x = (num + offset) / denom;
			}

			num = (a2 * c1) - (a1 * c2);
			if (num < 0){
			y = ( num - offset) / denom;
			}
			else {
			y = (num + offset) / denom;
			}
		}

//        var vx = vertices[2*closestVert] + closeAsteroid.CanvasPosX - this.posX;
//        var vy = vertices[2*closestVert + 1] + closeAsteroid.CanvasPosY - this.posY;
//        var uv = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
//
//        vx /= uv;
//        vy /= uv;
//
//        vx *= distance;
//        vy *= distance;
//
//        this.toX = this.posX + vx;
//        this.toY = this.posY + vy;

        c.strokeStyle = this.color;
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(this.posX, this.posY);
//        c.lineTo(this.toX, this.toY);
        c.lineTo(mouseX, mouseY);
        c.stroke();
    };

    this.getX = function()
    {
        return this.toX;
    };

    this.getY = function()
    {
        return this.toY;
    };

    this.getPower = function()
    {
        return this.power;
    };

    this.isOutofBounds = function()
    {
        return this.life > 5;
    };

	this.getShotType = function()
	{
		return this.type;
	};
}