import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETROMINOES_NAMES_LIGHT, TETROMINOES_NAMES_MEDIUM, TETROMINOES_NAMES_HARD, TETROMINOES_LIGHT, TETROMINOES_MEDIUM, TETROMINOES_HARD } from "./constans.js"

let TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
let TETROMINOES = TETROMINOES_MEDIUM;

(() => {
    const btnLevelEl = document.querySelectorAll('.button-level');
    const btnControlEl = document.querySelectorAll('.button-control');

    btnLevelEl.forEach(btn => {
        btn.addEventListener('click', onBtnLevelClick);
    });
    btnControlEl.forEach(btn => {
        btn.addEventListener('click', onBtnControlClick);
    });
})();

function onBtnLevelClick(event) {
    const btn = event.currentTarget;
    switch (true) {
        case btn.classList.contains('btn-level-easy'):
            TETROMINO_NAMES = [...TETROMINOES_NAMES_MEDIUM, ...TETROMINOES_NAMES_LIGHT];
            TETROMINOES = { ...TETROMINOES_MEDIUM, ...TETROMINOES_LIGHT };
            break;
        case btn.classList.contains('btn-level-medium'):
            TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
            TETROMINOES = TETROMINOES_MEDIUM;
            break;
        case btn.classList.contains('btn-level-hard'):
            TETROMINO_NAMES = [...TETROMINOES_NAMES_MEDIUM, ...TETROMINOES_NAMES_HARD];
            TETROMINOES = { ...TETROMINOES_MEDIUM, ...TETROMINOES_HARD };
            break;
        default:
            TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
            TETROMINOES = TETROMINOES_MEDIUM;
    };
};
function onBtnControlClick(event) {
    const btn = event.currentTarget;
    switch (true) {
        case btn.classList.contains('btn-control-rotate'):
            rotate();
            break;
        case btn.classList.contains('btn-control-left'):
            moveTetrominoLeft();
            break;
        case btn.classList.contains('btn-control-down'):
            moveTetrominoDown();
            break;
        case btn.classList.contains('btn-control-right'):
            moveTetrominoRight()
            break;
        // case btn.classList.contains('btn-control-drop-down'):

        //     break;
    };
};

const scoreEl = document.querySelector('.score-value');

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
}

let playfield;
let tetromino;
let score = 0;

function countScore(destroyRows) {
    switch (destroyRows) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 4:
            score += 100;
            break;
    }
    scoreEl.innerHTML = score;
}

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement(`div`);
        document.querySelector('.tetris-field').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
}

function generateTetromino() {

    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    const rowTetro = -2;

    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: column
    }
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (tetromino.matrix[row][column]) {
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }

    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino();
    countScore(filledRows.length);

}

function removeFillRows(filledRows) {
    for (let i = 0; i < filledRows.length; i++) {
        const row = filledRows[i];
        dropRowsAbove(row);
    }
}

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfield[row] = playfield[row - 1];
    }

    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}


function findFilledRows() {
    const fillRows = [];
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        let filledColumns = 0;
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] != 0) {
                filledColumns++;
            }
        }
        if (PLAYFIELD_COLUMNS === filledColumns) {
            fillRows.push(row);
        }
    }
    return fillRows;
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.tetris-field div');

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue;

            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {

            if (isOutsideOfTopboard(row)) continue;
            if (!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].classList.add(name);
        }
    }
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if (!isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

function rotate() {
    rotateTetromino();
    draw();
}

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
    }
    draw();
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }

    return rotateMatrix;
}

function moveTetrominoDown() {
    tetromino.row += 1;
    if (!isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrominoLeft() {
    tetromino.column -= 1;
    if (!isValid()) {
        tetromino.column += 1;
    }
}
function moveTetrominoRight() {
    tetromino.column += 1;
    if (!isValid()) {
        tetromino.column -= 1;
    }
}


// automatic tetromino movement down
function moveDown() {
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
};
let timedId = null;
moveDown();
function startLoop() {
    setTimeout(() => { timedId = requestAnimationFrame(moveDown); }, 700)
};
function stopLoop() {
    cancelAnimationFrame(timedId);
    timedId = clearTimeout(timedId);
};


//  collision / exit outside the gameboard
function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            // if(tetromino.matrix[row][column]) continue;
            if (isOutsideOfGameboard(row, column)) { return false; }
            if (hasCollisions(row, column)) { return false; }
        }
    }
    return true;
};

function isOutsideOfTopboard(row) {
    return tetromino.row + row < 0;
};

function isOutsideOfGameboard(row, column) {
    return tetromino.matrix[row][column] &&
        (
            tetromino.column + column < 0
            || tetromino.column + column >= PLAYFIELD_COLUMNS
            || tetromino.row + row >= PLAYFIELD_ROWS
        );
};

function hasCollisions(row, column) {
    return tetromino.matrix[row][column]
        && playfield[tetromino.row + row]?.[tetromino.column + column];
};