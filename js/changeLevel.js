import { TETROMINOES_NAMES_LIGHT, TETROMINOES_NAMES_MEDIUM, TETROMINOES_NAMES_HARD, TETROMINOES_LIGHT, TETROMINOES_MEDIUM, TETROMINOES_HARD } from "./constans.js"

let TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
let TETROMINOES = TETROMINOES_MEDIUM;

function onBtnLevelClick(event) {
    const btn = event.currentTarget;

    switch (true) {
        case btn.classList.contains('btn-level-easy'):
            TETROMINO_NAMES = TETROMINOES_NAMES_LIGHT;
            TETROMINOES = TETROMINOES_LIGHT;
            return TETROMINO_NAMES, TETROMINOES;
        // break;
        case btn.classList.contains('btn-level-medium'):
            TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
            TETROMINOES = TETROMINOES_MEDIUM;
            break;
        case btn.classList.contains('btn-level-hard'):
            TETROMINO_NAMES = TETROMINOES_NAMES_HARD;
            TETROMINOES = TETROMINOES_HARD;
            break;
        default:
            TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
            TETROMINOES = TETROMINOES_MEDIUM;
    }
}

export { onBtnLevelClick };