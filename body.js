class Body {
    constructor(node, speed) {
        this.prevNode = node;
        this.nextNode = node;
        this.posBetweenNodes = 0;

        this.speed = speed;
        this.movingDirection = Move.Neutral;
        this.bufferedMove = {
            timestamp: null,
            valid    : false,
            move     : Move.Neutral
        };
    }

    update() {
        if (this.prevNode == this.nextNode)
            return;

        this.posBetweenNodes += this.speed;
        if (this.posBetweenNodes > 1) {
            this.posBetweenNodes -= 1.0;
            this.prevNode = this.nextNode;
            this.resolveNextMove();
        }
    }

    resolveNextMove() {
        let previousMovingDirection = this.movingDirection;

        this.nextNode = this.resolveNextNodeFromBuffer() ?? this.prevNode;
        if (this.nextNode != this.prevNode) {
            this.movingDirection = (this.prevNode !== this.nextNode) ? this.bufferedMove.move : Move.Neutral;
        } else {
            this.nextNode = this.nextNode.neighbours[this.movingDirection] ?? this.prevNode;
            this.movingDirection = (this.prevNode !== this.nextNode) ? this.movingDirection : Move.Neutral;
        }

        if (this.movingDirection !== previousMovingDirection)
            this.movingDirection.bufferedMove.valid = false;
    }

    resolveNextNodeFromBuffer() {
        // Use buffered input if possible
        let bufferRelevant = Date.now() - this.bufferedMove.timestamp < BUFFER_WINDOW;
        this.bufferedMove.valid = this.bufferedMove.valid && bufferRelevant;
        if (this.bufferedMove.valid) {
            // Use buffered move if it even vaguely makes sense
            if (this.nextNode.neighbours[this.bufferedMove.move])
                return this.nextNode.neighbours[this.bufferedMove.move];
        }

        return undefined;
    }

    bufferMove(move) {
        if (!Object.values(Move).includes(move)) {
            console.log("Cannot buffer move, invalid move: " + move);
            return;
        }
        
        console.log("Buffered: " + move);
        this.bufferedMove.timestamp = Date.now();
        this.bufferedMove.valid = true;
        this.bufferedMove.move = move;

        // If currently not moving resolve direction according to buffer
        if (this.prevNode === this.nextNode) {
            console.log("Resolving new move with buffer: " + this.bufferedMove.move);
            this.posBetweenNodes = 0;
            this.resolveNextMove();
        }

        // Indices set up in a way that adding 2 always results in opposite direction
        if (this.movingDirection == (this.bufferedMove + 2) % 4) 
            this.turnAround();
    }

    turnAround() {
        this.posBetweenNodes = 1.0 - this.posBetweenNodes;
        let tempNode = this.prevNode;
        this.prevNode = this.nextNode;
        this.nextNode = tempNode;
        this.movingDirection = (this.movingDirection + 2) % 4;

        this.bufferedMove.valid = false;
    }
}