function doMouseMove(event)
{
//    if (!mouseClick) return;
    mouseX = event.clientX - event.target.offsetLeft;
    mouseY = event.clientY - event.target.offsetTop;
}

function doMouseDown(event)
{
    if (event.button === 0)
    {
        mouseClick = true;
    }
    else if (event.button === 2 || event.button === 1)
    {
        console.log('Other');
        event.preventDefault();
        return false;
    }
}

function doMouseUp(event)
{
    mouseClick = false;
}