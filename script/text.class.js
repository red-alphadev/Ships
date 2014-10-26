function Text(text, time)
{
    this.time = time;
    this.text = text;

    this.posx = canvasWidth / 2 - (text.length * 4);
    this.posy = canvasHeight / 3;

    this.done = false;


    this.draw = function(c, time)
    {
        c.font = '26px Impact';
        c.fillStyle = 'white';
        if (time - this.time < 1500)
        {
            c.fillText(this.text, this.posx, this.posy);
        }
        else
        {
            if (this.text.length > 0)
            {
                this.text = this.text.substring(1);
                c.fillText(this.text, this.posx, this.posy);
            }
            else
            {
                this.done = true;
            }
        }
    };

    this.isDone = function()
    {
        return this.done;
    };
}