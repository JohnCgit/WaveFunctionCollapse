function reverseString(s) {
    if(s === undefined) {
        return "";
    }
    let arr = s.split('');
    arr = arr.reverse();
    return arr.join('');
  }
  
function compareEdge(a, b) {
return a == reverseString(b);
}  

class Tile{

    constructor(p5,imagePath,edges, index) {

        this.img = p5.loadImage(process.env.PUBLIC_URL + imagePath);
        this.edges = edges;
        this.up = [];
        this.right = [];
        this.down = [];
        this.left = [];
        this.index = index;
    }
    

    analyze(tiles) {
        for (let i = 0; i < tiles.length; i++) {
          let tile = tiles[i];
          
          // UP
          if (compareEdge(tile.edges[2], this.edges[0])) {
            this.up.push(i);
          }
          // RIGHT
          if (compareEdge(tile.edges[3], this.edges[1])) {
            this.right.push(i);
          }
          // DOWN
          if (compareEdge(tile.edges[0], this.edges[2])) {
            this.down.push(i);
          }
          // LEFT
          if (compareEdge(tile.edges[1], this.edges[3])) {
            this.left.push(i);
          }
        }
      }
    
      rotate(p5,num) {
        const w = this.img.width;
        const h = this.img.height;
        const newImg = p5.createGraphics(w, h);
        newImg.imageMode(p5.CENTER);
        newImg.translate(w / 2, h / 2);
        newImg.rotate(p5.HALF_PI * num);
        newImg.image(this.img, 0, 0);
    
        const newEdges = [];
        const len = this.edges.length;
        for (let i = 0; i < len; i++) {
          newEdges[i] = this.edges[(i - num + len) % len];
        }
        return new Tile(newImg, newEdges, this.index);
      }
}

export default Tile;