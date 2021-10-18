class P2{

    constructor()
    {

        /**
         * green_list stores the coordinates of the toggled squares
         * and green_list_map stores the index of the toggled squares in the squares array.
         */
        this.green_list = [];
        this.green_list_map = [];
        this.grid = new Grid(400,400);
        this.grid.svg.addEventListener("mousedown",  this.toggle.bind(this));

    }

    /* function for handling the event when the generate button is clicked. This method creates the circle
    and appends to the svg*/
    click()
    {
            this.initializeCircleCenter();
            // try{
            //     this.initializeCircleCenter();
            // }catch(e)
            // {
            //     window.alert(e);
            // }
            var circle = new Circle(this.centerX, this.centerY, this.radius, 'green');
            this.grid.svg.appendChild(circle.getCircle());


    }

    /**
     * This function gets the X Coordinate and Y coordinate from the page, and generates the coordinate's mapping to a
     * square in the grid. After creating the mapping it changes the switches the color of the square from grey to blue
     * or blue to gray depending on the state of the square.
     * @param {*} e: captures the toggle event in screen
     */
    toggle(e)
    {   //Capture the toggle points from the screen
        var pt  = this.grid.svg.createSVGPoint(), svgP;
        pt.x = e.clientX;
        pt.y = e.clientY;
        svgP = pt.matrixTransform(this.grid.svg.getScreenCTM().inverse());

        if(this.grid.validateCoordinate(svgP.x, svgP.y))
        {
            var index = this.grid.findClosest(svgP.x, svgP.y);

            if(this.green_list_index(index) != -1)
            {
                this.grid.updateSquare(index[0],index[1],'Grey');
                this.green_list_remove_index(this.green_list_index(index));
            }
            else{
                this.grid.updateSquare(index[0],index[1],'Blue');
                this.green_list_map.push(index);
                this.green_list.push([this.grid.squares[index[0]][index[1]].xcoordinate,this.grid.squares[index[0]][index[1]].ycoordinate]);
            }
        }
    }



    /**Returns the Svg component of the grid */
    returnSvg()
    {
        return this.grid.svg;
    }

    /**Copmutes the jacobian for Gauss Newton Algorithm. The function calculates the partial derivate of f_i = r_i^2 - r^2 w.r.t u1, u2, r
     * @param {*} u1 x center coordinate of the circle
     * @param {*} u2 y center coordinate of the circle
     * @returns Jacobian
     */
    computeJacobian(u1, u2)
    {

        var jacobian = new Array(this.green_list.length);

        for (var i=0; i< this.green_list.length; i++)
        {
            jacobian[i] = new Array(2);
        }

        for (var i = 0; i< this.green_list.length; i++)
        {
                // derivative of function f w.r.t u1
                jacobian[i][0] = (u1 - this.green_list[i][0])/ this.grid.computeDistance(this.green_list[i][0], this.green_list[i][1],u1,u2);
                // derivative of function f w.r.t u2
                jacobian[i][1] = (u2 - this.green_list[i][1])/ this.grid.computeDistance(this.green_list[i][0], this.green_list[i][1],u1,u2);
                // derivative of function f w.r.t r
                jacobian[i][2] = -1;
        }
        return jacobian;
    }

    /**
     * Returns the negative of the function that we are minimizing. d_i = r_i - r. This function returns -(r_i -r)
     * @param {Number} x Center X coordinate
     * @param {Number} y Center Y coordinate
     * @param {Number} r radius
     * @returns {Array} returns -(r_i -r)
     */
    negFunctionEvaluation(x, y, r)
    {
        var negDistance = []
        for (var i = 0; i< this.green_list.length; i++)
        {
            var dist = (this.grid.computeDistance(x,y, this.green_list[i][0],this.green_list[i][1]) - r)*-1;
            negDistance.push(dist); 
        }
        return negDistance;
    }

    /**
     *We are minimizing the function d_i = r_i - r = sqrt((x -x_0)^2 +(y - y_0)^2) - r with respect to three unkowns x_0, y_0, r
     * The function can be re written as −2x_ix_0 − 2y_iy_0 + (x^2 + y^2 − r^2)+ (x^2 + y^2). For minimizing F, we will have to 
     * solve the linear least squares system A [x_0 y_0 x_0^2 + y_0^2 -r^2]^T. This function solves the least squares system and 
     * returns x_0, y_0 and r for Gauss Newton Algorithm
     */
    getInitial()
    {
        var A = new Array(this.green_list.length);
        for (var i=0; i< this.green_list.length; i++)
        {
            A[i] = new Array(2);
        }
        var b = []

        for (var i = 0; i < this.green_list.length; i++)
        {
                //2x_i, coefficient x_0
                A[i][0] = 2 * this.green_list[i][0];
                //2y_i, coefficient y_0
                A[i][1] = 2 * this.green_list[i][1];
                //-1, coefficient r
                A[i][2] = -1;
                //x^2 + y^2
                b[i] = (this.green_list[i][0] * this.green_list[i][0]) + (this.green_list[i][1] * this.green_list[i][1]);
        }

        var productReadyA = this.getProductReady(A);
        var output = math.multiply(productReadyA,b);

        //Solve for radius, x^2 + y^2 − r^2 = output._data[2]
        output._data[2] = math.sqrt(output._data[0] * output._data[0] + output._data[1] * output._data[1] - output._data[2]); 

        return output;
    } 


    /**
     * This function check the update to determine convergence If the update starts getting small, we will stop iterating 
     * @param {Array} updated the value of parameters where update[0] = xcenter perturbation, update[1] = ycenter perturbation
     * and  update[2] = radius perturbation
     * @returns {boolean} if the perturbation is very small returns false 
     */
    convergenceCriteria( updated)
    {
        if(Math.abs(updated._data[0])<1 && Math.abs(updated._data[1])<1 && Math.abs(updated._data[2])<5 )
        {
            return true;
        }else
        {
            return false;
        }
    }

    /**This function prepeares the data point matrix for solving linear least-squares system. For eqn Ax=b, this function 
     * computes  Inv(A_transpose * A)* A_transpose
     * @param {*} matrix 
     * @returns Inv(A_transpose * A)* A_transpose for multiplying with mirror b to solve the linear least-squares system
     */
    getProductReady(matrix)
    {
        var mat = math.matrix(matrix);
        return math.multiply(math.inv( math.multiply(math.transpose(mat),mat)),math.transpose(mat));
    }

    initializeCircleCenter()
    {
        /**
         * Since the algorithm calculates only from triplets, it throws an exception when only two points are entered
         */

        //Get initial coordinates and radius
        var initCenter =  this.getInitial();
        var initCenterX = initCenter._data[0];
        var initCenterY = initCenter._data[1];
        var initRadius = initCenter._data[2];

        //Computes the jacobian and multiplies with -d_i where d_i = r_i - r is the the function that we are trying to minimize
        var jacobian = this.computeJacobian(initCenterX, initCenterY);
        var productReadyJacob = this.getProductReady(jacobian);
        var negDistance = this.negFunctionEvaluation(initCenterX, initCenterY, initRadius);
        var updated = math.multiply(productReadyJacob,negDistance);
        
        //hyperparameter
        var maxIter = 200;
        
        var i = 0;
        //convergence critreria

        while(i < maxIter)
        {
            //Performs convergence check
            if(this.convergenceCriteria(updated))
            {
                break;
            } 
            //Update step as part of the Gauss Newton algorithm
            initCenterX = initCenterX  + updated._data[0];
            initCenterY = initCenterY  + updated._data[1];
            initRadius = initRadius + updated._data[2];
            //compute jacobian with new center and radius
            jacobian = this.computeJacobian(initCenterX, initCenterY);
            //try catch block for preventing inverse of a singular matrix
            try{
                productReadyJacob = this.getProductReady(jacobian);
            }catch(e)
            {
                break;
            }
            negDistance = this.negFunctionEvaluation(initCenterX, initCenterY, initRadius);
            updated = math.multiply(productReadyJacob,negDistance);
            i = i+1;
        }

        this.centerX = initCenterX;
        this.centerY = initCenterY;
        this.radius = initRadius;        
    }


    /** This function checks whether the provided index is present in the green_list_map
     * @param {Number} index
     * @returns index of the element in the green_list array if found or -1  if not found
     */
    green_list_index(index)
    {

        for (var i = 0 ; i< this.green_list_map.length; i++)
        {
                if (this.green_list_map[i][0] == index[0] && this.green_list_map[i][1] == index[1])
                {
                    return i;
                }
        }
        return -1;
    }


    /** This function removes the element at the given index from both green_list and green_list_map array
     * @param {Number} index
     */
    green_list_remove_index(index)
    {
        this.green_list.splice(index, 1);
        this.green_list_map.splice(index,1);
    }
}
