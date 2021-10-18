class Square {
    /**
     * 
     * @param {*} xcoordinate x coordinate of the begining of the square
     * @param {*} ycoordinate y coordinate of the begining of the square
     * @param {*} state 
     */
    constructor(xcoordinate, ycoordinate, state) {
        this.xcoordinate=xcoordinate;
        this.ycoordinate=ycoordinate;
        this.state = state;
        this.sqr = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.sqr.setAttribute('width', '5');
        this.sqr.setAttribute('height', '5');
        this.sqr.setAttribute('x', this.xcoordinate);
        this.sqr.setAttribute('y', this.ycoordinate);
        this.sqr.setAttribute('fill', this.state);
    }

    /**
     * @returns returns the square, svg
     */
    getSquare()
    {
        return this.sqr;
    }

    /**
     * This function sets the color of the square
     * @param {String} color : color of the square
     */
    setColor(color)
    {
        this.color = color;
    }
  }
  