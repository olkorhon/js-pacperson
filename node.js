class Node {
    constructor(x, y, visited, special) {
        this.neighbours = {
            [Move.Up]   : null,
            [Move.Down] : null,
            [Move.Left] : null,
            [Move.Right]: null,
        }

        this.x = x;
        this.y = y;

        this.visited = visited;
        this.special = special;
    }

    setNeighbours(above, below, left, right) {
        this.neighbours[Move.Up   ] = above;
        this.neighbours[Move.Down ] = below;
        this.neighbours[Move.Left ] = left;
        this.neighbours[Move.Right] = right;
    }

    visit() {
        if (this.visited == false) {
            this.visited = true;
            score += 10;
        }
    }

    draw() {
        if (this.special) {
            context.drawImage(sprites,
                TILE_W                , 0                     , TILE_W       , TILE_H,
                this.x * CANVAS_TILE_W, this.y * CANVAS_TILE_H, CANVAS_TILE_W, CANVAS_TILE_H);
        } else {
            context.drawImage(sprites, 
                0                     , 0                     , TILE_W       , TILE_H,
                this.x * CANVAS_TILE_W, this.y * CANVAS_TILE_H, CANVAS_TILE_W, CANVAS_TILE_H);
        }
    }
}