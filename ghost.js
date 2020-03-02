const GhostType = {
    random: 0
} 

class Ghost {
    constructor(node, type, speed) {
        this.type = type;
        this.body = new Body(node, speed);
    }

    update() {
        this.body.update();
    }

    draw() {
        let x = this.body.prevNode.x
        let y = this.body.prevNode.y;

        context.drawImage(sprites,
            this.body.movingDirection * TILE_W , (2 + this.type) * TILE_H, TILE_W       , TILE_H,
            x * CANVAS_TILE_W             , y * CANVAS_TILE_H       , CANVAS_TILE_W, CANVAS_TILE_H);
    }
}