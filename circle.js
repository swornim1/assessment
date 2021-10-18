class Circle {
    /**
     * Create a new circle with parameters provided by the user
     * @param {Number} centerXCoordinate 
     * @param {Number} centerYCoordinate 
     * @param {Number} radius 
     * @param {Color} color 
     */
    constructor(centerXCoordinate, centerYCoordinate, radius, color) {
        this.xcoordinate=centerXCoordinate;
        this.ycoordinate=centerYCoordinate;
        this.radius = radius;
        this.color = color;
        this.circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        this.circ.setAttribute('cx', this.xcoordinate);
        this.circ.setAttribute('cy', this.ycoordinate);
        this.circ.setAttribute('r', this.radius);
        
        this.circ.setAttribute('stroke',this.color);
        this.circ.setAttribute('stroke-width', '0.5%');
        this.circ.setAttribute('fill-opacity', '0');
        
    }
    /**
     * Function returns the circle
     * @returns the circle
     */
    getCircle()
    {
        return this.circ;
    }

    /**
     * Sets the color of the square
     * @param {string} color 
     */
    setColor(color)
    {
        this.color = color;
    }
  }