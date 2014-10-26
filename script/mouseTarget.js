function MouseTracking()
{
    this.length = 7;

    this.draw = function(c)
    {
        c.strokeStyle = 'white';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(mouseX - this.length, mouseY + this.length);
        c.lineTo(mouseX + this.length, mouseY - this.length);

        c.moveTo(mouseX + this.length, mouseY + this.length);
        c.lineTo(mouseX - this.length, mouseY - this.length);
        c.stroke();
    }
}