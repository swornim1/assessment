class p1
{
   constructor()
    {

        this.grid = new Grid(400,400);
        this.green_indexes = [];
        this.permanent_green_indexes =[];

        //setup empty circle
        this.initialCircle = new Circle(0,0, 0,  'Blue');
        this.grid.svg.appendChild(this.initialCircle.getCircle());
        

        //Setup listeners
        this.grid.svg.addEventListener("mousedown",  this.start.bind(this));
        this.grid.svg.addEventListener("mousemove",  this.move.bind(this)); 
        this.grid.svg.addEventListener("mouseup",  this.end.bind(this));


    }

    returnSvg()
    {
        return this.grid.svg;
    }


    /* function for handling the event when the mouse is pressed down.*/
    start(e)
    {
        
        this.radiusXOne = 0, this.radiusYOne = 0, this.radiusXTwo = 0, this.radiusYTwo = 0;
        //gathers the click information
        var pt  = this.grid.svg.createSVGPoint(), svgP;
        pt.x = e.clientX;
        pt.y = e.clientY;
        svgP = pt.matrixTransform(this.grid.svg.getScreenCTM().inverse());
        
        //radiusXOne and radiusYOne is the center of the circle
        this.radiusXOne = svgP.x;
        this.radiusYOne = svgP.y;
        
        //sets the move flag to true, so we can start building the circle 
        this.moved = true;
        
    }

    /* function for handling the event when the mouse is moved.*/
    move(e)
    {
        
        if (this.moved == true)
        {
            //remove the earlier circle as we are moving the mouse and creating a new circle
            this.grid.svg.removeChild(this.initialCircle.getCircle());
            
            //gathers the click information
            var pt  = this.grid.svg.createSVGPoint(), svgP;
            pt.x = e.clientX;
            pt.y = e.clientY;
            svgP = pt.matrixTransform(this.grid.svg.getScreenCTM().inverse());

            //Compute the radius and update the circle as the mouse is being moved
            this.radius = this.grid.computeDistance(this.radiusXOne, this.radiusYOne, svgP.x, svgP.y);
            this.initialCircle = new Circle(this.radiusXOne,this.radiusYOne, this.radius,  'Blue');
            this.grid.svg.appendChild(this.initialCircle.getCircle());

        }
    }


    /* function for handling the event when the mouse is released.*/
    end(e)
    {

            var pt  = this.grid.svg.createSVGPoint(), svgP;
            pt.x = e.clientX;
            pt.y = e.clientY;
            svgP = pt.matrixTransform(this.grid.svg.getScreenCTM().inverse());
            this.radiusXTwo =  svgP.x;
            this.radiusYTwo =  svgP.y;
            this.createCircle();

            //setup for new circles
            this.moved = false;
            this.initialCircle = new Circle(0,0, 0,  'Blue');
            this.grid.svg.appendChild(this.initialCircle.getCircle());
    }

    
    /* this function is the entry points for functions that creates the boundary circles.*/
    createCircle()
    {
        this.updateDots();
        this.updateSvg();              
    }


    /** This function uses the Mid-Point circle algorithm to find the dots for making a circle. The algorithm first 
     finds the first point on the circumference using the radius. Then determines the next possible move
     by evaluating the midpoints of the next possible moves. 
     */
    updateDots()
    {

        var centerCoordinates = this.grid.findClosest(this.radiusXOne, this.radiusYOne);
        var firstCoordinates = this.grid.findClosest(this.radiusXOne, this.radiusYOne + this.radius);


        var arrRadius = Math.abs(firstCoordinates[1] - centerCoordinates[1]); 

        var d = (5 - (arrRadius * 4))/4;
        var x = 0;
        var y = arrRadius;
        
        //Builds the circle
        do {
            
            if(this.iteratorCheck(centerCoordinates[0]+x,centerCoordinates[1]+y))
            {
                this.green_indexes.push([centerCoordinates[0]+x,centerCoordinates[1]+y]);
                if(!this.findGreenIndex(centerCoordinates[0]+x,centerCoordinates[1]+y, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]+x,centerCoordinates[1]+y]);
                }
                
            }

            
            if(this.iteratorCheck(centerCoordinates[0]+x,centerCoordinates[1]-y))
            {
                this.green_indexes.push([centerCoordinates[0]+x,centerCoordinates[1]-y])
                if(!this.findGreenIndex(centerCoordinates[0]+x,centerCoordinates[1]+y, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]+x,centerCoordinates[1]-y]);
                }
            }

            
            if(this.iteratorCheck(centerCoordinates[0]-x,centerCoordinates[1]+y))
            {
                this.green_indexes.push([centerCoordinates[0]-x,centerCoordinates[1]+y])
                if(!this.findGreenIndex(centerCoordinates[0]-x,centerCoordinates[1]+y, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]-x,centerCoordinates[1]+y]);
                }
            }

            
            if(this.iteratorCheck(centerCoordinates[0]-x,centerCoordinates[1]-y))
            {
                this.green_indexes.push([centerCoordinates[0]-x,centerCoordinates[1]-y])
                if(!this.findGreenIndex(centerCoordinates[0]-x,centerCoordinates[1]-y, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]-x,centerCoordinates[1]-y]);
                }
            }

            
            if(this.iteratorCheck(centerCoordinates[0]+y,centerCoordinates[1]+x))
            {
                this.green_indexes.push([centerCoordinates[0]+y,centerCoordinates[1]+x])
                if(!this.findGreenIndex(centerCoordinates[0]+y,centerCoordinates[1]+x, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]+y,centerCoordinates[1]+x]);
                }
            }
            
            
            if(this.iteratorCheck(centerCoordinates[0]+y,centerCoordinates[1]-x))
            {
                this.green_indexes.push([centerCoordinates[0]+y,centerCoordinates[1]-x])
                if(!this.findGreenIndex(centerCoordinates[0]+y,centerCoordinates[1]-x, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]+y,centerCoordinates[1]-x]);
                }                
            }
            
            
            if(this.iteratorCheck(centerCoordinates[0]-y,centerCoordinates[1]+x))
            {
                this.green_indexes.push([centerCoordinates[0]-y,centerCoordinates[1]+x])
                if(!this.findGreenIndex(centerCoordinates[0]-y,centerCoordinates[1]+x, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]-y,centerCoordinates[1]+x]);
                }                    
            }

            
            if(this.iteratorCheck(centerCoordinates[0]-y,centerCoordinates[1]-x))
            {
                this.green_indexes.push([centerCoordinates[0]-y,centerCoordinates[1]-x])
                if(!this.findGreenIndex(centerCoordinates[0]-y,centerCoordinates[1]-x, this.permanent_green_indexes))
                {
                    this.permanent_green_indexes.push([centerCoordinates[0]-y,centerCoordinates[1]-x]);
                }     
            }

            if (d < 0) {
                d += 2*x + 1;
            } else {
                d += 2*(x - y) + 1;
                y--;
            }
            x++;
        } while (x <= y);

        //Find the shortest and farthest distance
        var shortest = 500;
        var farthest  = -1;
        for(var i = 0 ; i<this.green_indexes.length; i++)
        {

            var distance = this.grid.computeDistance(this.grid.squares[centerCoordinates[0]][centerCoordinates[1]].xcoordinate, this.grid.squares[centerCoordinates[0]][centerCoordinates[1]].ycoordinate, this.grid.squares[this.green_indexes[i][0]][this.green_indexes[i][1]].xcoordinate, this.grid.squares[this.green_indexes[i][0]][this.green_indexes[i][1]].ycoordinate);

            if(distance > farthest)
            {
                farthest = distance;
            }

            if (distance < shortest)
            {
                shortest = distance;
       
            }
        }


        //calibrating to avoid the circles to overlap
        if (farthest - this.radius < 5 )
        {
            farthest = this.radius + 3;
 
        }

       this.farthestCircle = new Circle(this.radiusXOne, this.radiusYOne, farthest ,  'red');
       this.grid.svg.appendChild(this.farthestCircle.getCircle());

       if (this.radius - shortest < 5 )
       {
            shortest = this.radius - 5;

       }
       this.shortestCircle = new Circle(this.radiusXOne, this.radiusYOne, shortest,  'red');
       this.grid.svg.appendChild(this.shortestCircle.getCircle());
                  
    }

    /** This function checks whether a iterator is valid or not  
	@param {Number} itOne: x coordinate from the mouse click event 
    @param {Number} itTwo: y coordinate from the mouse click event 
	@return {Boolean} true if the iterator is in a desired range false otherwise
    */
    iteratorCheck (itOne, itTwo)
    {
        if(itOne >= 0 && itOne < 20 && itTwo >= 0 && itTwo <20)
        {
            return true;
        }else
        {
            return false;
        }
    }


    /** This function removes all the squares from the grid and updates them with appropriate coloring after constructing the circle */
    updateSvg()
    {

        this.updatedSquares = new Array(20);

        for (var i=0; i< 20; i++)
        {
            this.updatedSquares[i] = new Array(20);
        }
            
        for (var i=0; i< 20; i++)
        {
            for (var j=0; j< 20; j++)
            {
                this.grid.svg.removeChild(this.grid.squares[i][j].getSquare());
                 
            }
        
        }
        var indexX = 0;
        var indexY = 0;
     
        for (var i = 0; i < this.grid.height;)
        {
            for(var j=0; j < this.grid.width; )
            {
               if(this.findGreenIndex(indexX,indexY, this.permanent_green_indexes))
               {
                    this.updatedSquares[indexX][indexY] = new Square(i, j, 'Blue');
               }else
               {
                    this.updatedSquares[indexX][indexY] = new Square(i, j, 'Grey');
               }

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
                this.grid.svg.appendChild(this.updatedSquares[i][j].getSquare());
            }
        
        }
        this.grid.squares = this.updatedSquares;
        this.green_indexes = []
    }


    /** This function is a lookup function to see whether the given indices are blue grids( grids that are part of the circle )
	@param {Number} x1: x grid index
    @param {Number} y1: y grid index
	@return {Boolean} return true if the given indices are part of the blue grids( grids that are part of the circle) else returns false
    */
    findGreenIndex(indexX, indexY, array)
    {
        for(var i = 0 ; i<array.length; i++)
        {
            if(indexX == array[i][0] && indexY == array[i][1])
            {
                return true;
            }
        }
        return false;
    }    


}