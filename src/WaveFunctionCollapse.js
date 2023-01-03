import { useRef,useEffect,useMemo } from "react";
import Tile from "./Tile";
import Sketch from "react-p5";



const Canvas = props =>{

    const canvasRef = useRef(null);


    const width = 100;
    const height = 100;

    let grid = [];
    const DIM = 2;

    const BLANK = 0;
    const UP = 1;
    const RIGHT = 2;
    const DOWN = 3; 
    const LEFT = 4;
    const tiles = [];

    const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
        console.log("here");
		p5.createCanvas(width, height).parent(canvasParentRef);
        tiles[0] = new Tile(p5,'/tiles/blank.png',['0','0','0','0'],0);
        tiles[1] = new Tile(p5,'/tiles/up.png',['1','1','0','1'],1);
        tiles[2] = new Tile(p5,'/tiles/right.png',['1','1','1','0'],1);
        tiles[3] = new Tile(p5,'/tiles/down.png',['0','1','1','1'],1);
        tiles[4] = new Tile(p5,'/tiles/left.png',['1','0','1','1'],1);
        tiles.forEach(tile => tile.analyze(tiles));
        startOver();
	};

    function startOver() {
        // Create cell for each spot on the grid
        for (let i = 0; i < DIM * DIM; i++) {
            grid[i] = {
                collapsed: false,
                options: [BLANK,UP,RIGHT,DOWN,LEFT]
            };
        }
      }

      function checkValid(arr, valid) {
        for (let i = arr.length - 1; i >= 0; i--) {
          
          let element = arr[i];
          if (!valid.includes(element)) {
            arr.splice(i, 1);
          }
        }
      }
 
    function random (list) {
        return list[Math.floor((Math.random()*list.length))];
      }

    const draw = (p5) => {
        p5.background(0);

        const w = width / DIM;
        const h = height / DIM;
        for (let j = 0; j < DIM; j++) {
            for (let i = 0; i < DIM; i++) {
                let cell = grid[i + j * DIM];
                if (cell.collapsed) {
                    let index = cell.options[0];
                    p5.image(tiles[index].img, i * w, j * h, w, h);
                } else {
                    p5.noFill();
                    p5.stroke(51);
                    p5.rect(i * w, j * h, w, h);
                }
            }
	    };
        collapse();
    }

    function collapse(){

        const gridCopy = grid.slice();

        gridCopy.sort( (a,b) => a.options.length - b.options.length);

        const cell = random(gridCopy.filter(c => c.options.length == gridCopy[0].options.length ));

        cell.collapsed = true;

        const pick = random(cell.options);

        if (pick === undefined) {
            startOver();
            return;
        }
        cell.options = [pick];


        const nextGrid = [];

        for (let j = 0; j < DIM; j++) {
            for (let i = 0; i < DIM; i++) {            
                let cell = grid[i + j*DIM];
                if(cell.collapsed)
                {        
                    nextGrid[i + j*DIM] = cell;
                }else{
                    let options = new Array(tiles.length).fill(0).map((x, i) => i);
                    // Look up
                    if (j > 0) {
                        let up = grid[i + (j - 1) * DIM]; 
                        let validOptions = [];
                        for (let option of up.options) {
                            let valid = tiles[option].down;
                            validOptions = validOptions.concat(valid);
                        }
                        checkValid(options, validOptions);
                    }
                    // Look right
                    if (i < DIM - 1) {
                        let right = grid[i + 1 + j * DIM];
                        let validOptions = [];
                        for (let option of right.options) {
                            let valid = tiles[option].left;
                            validOptions = validOptions.concat(valid);
                        }
                        checkValid(options, validOptions);
                    }
                    // Look down
                    if (j < DIM - 1) {
                        let down = grid[i + (j + 1) * DIM];
                        let validOptions = [];
                        for (let option of down.options) {
                            let valid = tiles[option].up;
                            validOptions = validOptions.concat(valid);
                        }
                        checkValid(options, validOptions);
                    }
                    // Look left
                    if (i > 0) {
                        let left = grid[i - 1 + j * DIM];
                        let validOptions = [];
                        for (let option of left.options) {
                            let valid = tiles[option].right;
                            validOptions = validOptions.concat(valid);
                        }
                        checkValid(options, validOptions);
                    }
                    cell.options = options
                    nextGrid[i + j*DIM] = cell;
                }
            }
        }    
        grid = nextGrid;
    }
    
    return <div onClick={startOver}> <Sketch setup={setup} draw={draw}/> </div>
}

export default Canvas;