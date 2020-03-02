class Player {
    constructor(node, speed) {
        this.body = new Body(node, speed);
    }

    update() {
        this.body.update();

        if (this.body.posBetweenNodes < 0.3 && this.body.prevNode.visited == false)
            this.body.prevNode.visit();
        if (this.body.posBetweenNodes > 0.7 && this.body.nextNode.visited == false)
            this.body.nextNode.visit();
    }

    bufferMove(move) {
        this.body.bufferMove(move);
    }

    draw() {
        let x = this.body.posBetweenNodes * (this.body.nextNode.x - this.body.prevNode.x) + this.body.prevNode.x;
        let y = this.body.posBetweenNodes * (this.body.nextNode.y - this.body.prevNode.y) + this.body.prevNode.y;
        
        context.drawImage(sprites,
            this.body.movingDirection * TILE_W       , TILE_H           , TILE_W       , TILE_H,
            x * CANVAS_TILE_W, y * CANVAS_TILE_H, CANVAS_TILE_W, CANVAS_TILE_H);
    }
}