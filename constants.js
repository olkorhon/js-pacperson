const IMAGE_W = 55;
const IMAGE_H = 55;

const CANVAS_W = 660;
const CANVAS_H = 660;

const TILE_W = 5;
const TILE_H = 5;

const CANVAS_TILE_W = 60;
const CANVAS_TILE_H = 60;

const BUFFER_WINDOW = 1000000; // ms

// Indices set up in a way that adding 2 always results in opposite direction
const Move = {
    Up     : 0,
    Left   : 1,
    Down   : 2,
    Right  : 3,

    Neutral: 4
}

const offsetTableX = {0:  0, 1: -1, 2: 0, 3: 1}
const offsetTableY = {0: -1, 1:  0, 2: 1, 3: 0}