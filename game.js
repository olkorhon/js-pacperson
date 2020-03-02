window.addEventListener('load', gameOnload);
let canvas;
let context;

let background;
let sprites;

let score = 0;
let data = [
    "           ",
    "  .......  ",
    " .o   . o. ",
    " . .qwe. . ",
    " ...   . . ",
    " . ..... . ",
    " . .   ... ",
    " . ..p.. . ",
    " .o .   o. ",
    "  .......  ",
    "           "
];

let nodes;
let extraNodes;
let player;
let ghosts;

function gameOnload() {
    console.log("game.js onload triggered");
    window.removeEventListener('load', gameOnload);
        
    canvas  = document.getElementById("canvas");
    context = canvas.getContext("2d");	
    
    background = document.createElement("IMG");
    sprites    = document.createElement("IMG");
    
    background.src = "Background.png";
    sprites.src    = "Sprites.png";

    console.log(`Loading: "${background.src}" and "${sprites.src}"`);
    let promises = [];
    promises.push(new Promise(resolve => background.addEventListener("load", resolve)));
    promises.push(new Promise(resolve => sprites.addEventListener("load", resolve)));
    
    document.addEventListener("keydown", (event) => {
        switch (event.keyCode) {
            case 38: player.bufferMove(Move.Up   ); break;
            case 40: player.bufferMove(Move.Down ); break;
            case 37: player.bufferMove(Move.Left ); break;
            case 39: player.bufferMove(Move.Right); break;
        }
    })

    console.log("Initializing nodes");
    initializeNodes();

    Promise.all(promises).then(() => {
        console.log("Graphics loaded");
        setInterval(() => {
            player.update();
            ghosts.forEach(ghost => ghost.update());
            
            context.clearRect(0, 0, CANVAS_W, CANVAS_H);
            context.imageSmoothingEnabled = false;
            context.drawImage(background, 
                0, 0, IMAGE_W , IMAGE_W,
                0, 0, CANVAS_W, CANVAS_H);

            for (let j = 0; j < 11; j++) {
                for (let i = 0; i < 11; i++) {
                    if (nodes[j][i] && nodes[j][i].visited == false)
                        nodes[j][i].draw();
                }
            }

            for (let i = 0; i < extraNodes.length; i++) {
                if (extraNodes[i].visited == false)
                    extraNodes[i].draw();
            }

            player.draw();
            ghosts.forEach(ghost => ghost.draw());
        }, 16);
    });
}

function initializeNodes() {
    player = null;
    ghosts = [];
    nodes = [];
    extraNodes = [];
    
    for (let j = 0; j < 11; j++) {
        const row = [];
        for (let i = 0; i < 11; i++) {
            if (data[j][i] == " ") {
                row.push(null);
                continue;
            }

            let node = new Node(i, j, false, false);
            processSymbol(data[j][i], node);
            row.push(node);
        }
        nodes.push(row);
    }

    for (let j = 0; j < 11; j++) {
        for (let i = 0; i < 11; i++) {
            if (!nodes[j][i]) continue;

            nodes[j][i].setNeighbours(
                j >  0 ? nodes[j - 1][i] : null,
                j < 10 ? nodes[j + 1][i] : null,
                i >  0 ? nodes[j][i - 1] : null,
                i < 10 ? nodes[j][i + 1] : null
            );
        }
    }

    // Split nodes...
    nodeList = [];
    for (let j = 0; j < 11; j++) {
        const row = [];
        for (let i = 0; i < 11; i++)
            row.push(false);
        nodeList.push(row);
    }
    
    for (let j = 0; j < 11; j++) {
        for (let i = 0; i < 11; i++) {
            if (!nodes[j][i]) continue;

            for (let k = 0; k < 4; k++) {
                const node = nodes[j][i].neighbours[k];
                if (!node) continue;
                
                let offsetX = offsetTableX[k];
                let offsetY = offsetTableY[k];

                if (!nodeList[j + offsetY][i + offsetX]) {
                    const newNode = new Node(
                        nodes[j][i].x + (node.x - nodes[j][i].x) / 2,
                        nodes[j][i].y + (node.y - nodes[j][i].y) / 2,
                        false,
                        false);

                    nodes[j][i].neighbours[k] = newNode;
                    node.neighbours[(k + 2) % 4] = newNode;
                    newNode.neighbours[k          ] = node;
                    newNode.neighbours[(k + 2) % 4] = nodes[j][i];

                    extraNodes.push(newNode);
                }
            };
            nodeList[j][i] = true;
        }
    }

    console.log(nodes);
}

function processSymbol(symbol, node) {
    switch(symbol) {
        default:
        case ".":
            break;
        case "o":
            node.special = true;
            break;
        case "p":
            player = new Player(node, 0.1);
            node.visited = true;
            console.log("Player found: " + player);
            break;
        case "q":
            ghosts.push(new Ghost(node, 0, 0.1));
            node.visited = true;
            console.log("Ghost found: " + ghosts[ghosts.length - 1]);
            return;
        case "w":
            ghosts.push(new Ghost(node, 1, 0.125));
            node.visited = true;
            console.log("Ghost found: " + ghosts[ghosts.length - 1]);
            return;
        case "e":
            ghosts.push(new Ghost(node, 2, 0.125));
            node.visited = true;
            console.log("Ghost found: " + ghosts[ghosts.length - 1]);
            break;
    }
}