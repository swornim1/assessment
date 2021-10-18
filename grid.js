class Grid
{
    constructor(height,width)
    {

        this.height = height;
        this.width = width;

        this.squares = new Array(20);

        for (var i=0; i< 20; i++)
        {
            this.squares[i] = new Array(20);
        }

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width',this.height);
        this.svg.setAttribute('height',this.width);
        var indexX = 0;
        var indexY = 0;
     
        for (var i = 0; i < this.height;)
        {
            for(var j=0; j < this.width; )
            {
                this.squares[indexX][indexY] = new Square(i, j, 'Grey');
                
                indexY= indexY+1;
                j=j+20;

            }
            i = i+20;
            indexX = indexX+1;
            indexY = 0;
        }

        for (var i=0; i< 20; i++)
        {
            for (var j=0; j< 20; j++)
            {
                this.svg.appendChild(this.squares[i][j].getSquare());
            }
        
        }
    }

    returnSvg()
    {
        
        return this.svg;
    }

    /** Function rounds number to return the number closest to multiple of 20
	    @param {Number} num: number on the grid
	    @return {Number} number closest to the multiple of 20            
     */
    roundNumbers( num )
    {
        num = (num + 7) / 20;
        num = Math.floor(num);
        return num * 20;
    }

    /** This function validates whether the clicked region in the screen is part of the grid or not
    * 
    * @param {Number} x: x coordinate where the screen is clicked
    * @param {Number} y: y coordinate where the screen is clicked
    * @returns true or false depedning on whether the coordinate was clicked or not
    */
    validateCoordinate(x, y)
    {
        var xVal = false;
        var yVal = false;
        for(var i = 0; i<5; i++)
        {
            if( (x - i )% 20 == 0)
            {
                xVal = true;
            }
            if( (y - i )% 20 == 0)
            {
                yVal = true;
            }
                 
        }
        
        return xVal && yVal ;
    }
    /**
     * This function updates the color of the grid at the given indices
     * @param {Number} i: 1st index of the 2d grid element
     * @param {Number} j: 2nd index of the 2d grid element
     * @param {String} color: new color for the square at given indices
     */
    updateSquare(i, j, color)
    {
        this.svg.removeChild(this.squares[i][j].getSquare());
        this.squares[i][j] = new Square(this.squares[i][j].xcoordinate,this.squares[i][j].ycoordinate, color )
        this.svg.appendChild(this.squares[i][j].getSquare());
    }


    /** This function returns the indices of the nearest square in the grid provided the coordinates in the screen
	@param {Number} x1: x coordinate from the screen
    @param {Number} y1: y coordinate from the screen
	@return {Tuples} indices of a 2d array representing the square closest to the x1 and y1 coordinates
    */
     findClosest(xCoordinate, yCoordinate)
     {
         xCoordinate = this.roundNumbers(xCoordinate);
         yCoordinate = this.roundNumbers(yCoordinate);
         for (var i=0; i<20; i++)
         {
             for(var j=0; j<20; j++)
             {
 
                 if(xCoordinate == this.squares[i][j].xcoordinate && yCoordinate == this.squares[i][j].ycoordinate)
                 {
                     return [i, j];
                 }
             }
 
             
         }
    }

    /** This function calculates the distance between two coordinates
	@param {Number} x1: x coordinate of first point
    @param {Number} y1: y coordinate of first point
	@param {Number} x2: x coordinate of second point
	@param {Number} y2: y coordinate of second point
	@return {Number} distance between two coordinates
    */
    computeDistance(x1, y1, x2, y2)
    {
        return Math.sqrt(((x2-x1)**2 + (y2-y1)**2));
    }
}