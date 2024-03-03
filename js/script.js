import {
    PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETROMINOES_NAMES_EASY, TETROMINOES_NAMES_MEDIUM, TETROMINOES_NAMES_HARD,
    TETROMINOES_EASY, TETROMINOES_MEDIUM, TETROMINOES_HARD, BEST_RESULT_EASY_KEY, BEST_RESULT_MEDIUM_KEY, BEST_RESULT_HARD_KEY, MUTE_KEY
} from "./constans.js"
import { startAudio, gameOverAudio, rotateAudio, moveAudio, putAudio, deleteAudio } from "./constAudio.js";
import {
    playFieldElem, scoreElem, bestResElem, muteBtn, muteBtnValue, modalScoreElem, modalbestResElem, modalPause, continueBtn, modalGameOver, modalRestartBtn,
    formFieldElem, inputElem, nextTetroImg
} from "./constDOM.js";

let TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
let TETROMINOES = TETROMINOES_MEDIUM;
let level = 'medium';
let speed = 700;
let playfield;
let tetromino;
let score = 0;
let timedId = null;
let isGameOver = false;
let isPaused = false;
let isMute = false;
let cells;
let nextTetrominoName = null;
let bestResultСurrent = {
    value: 0,
    name: "",
}
let bestResultEasy = {
    value: 0,
    name: "",
}
let bestResultMedium = {
    value: 0,
    name: "",
}
let bestResultHard = {
    value: 0,
    name: "",
}

document.addEventListener('keydown', onKeyDown);
muteBtn.addEventListener("click", onMuteBtnClick);
continueBtn.addEventListener("click", onContinueBtnClick);
modalRestartBtn.addEventListener("click", onModalRestartBtnClick);

(() => {
    const btnLevelEl = document.querySelectorAll('.button-level');
    const btnControlEl = document.querySelectorAll('.button-control');
    const btnGameStatelEl = document.querySelectorAll('.button-game-state');

    btnLevelEl.forEach(btn => {
        btn.addEventListener('click', onBtnLevelClick);
        btn.addEventListener('click', function () {
            // Знімаємо клас 'active' з усіх кнопок
            btnLevelEl.forEach(btn => btn.classList.remove('active'));
            // Додаємо клас 'active' тільки для поточної кнопки
            this.classList.add('active');
        });

    });
    btnGameStatelEl.forEach(btn => {
        btn.addEventListener('click', onBtnGameStateClick);
    });
    btnControlEl.forEach(btn => {
        btn.addEventListener('click', onBtnControlClick);
    });
})();

init();

function init() {
    // при першому запуску гри мелодія може не грати, так як браузер можа заблокувати автовідтворення
    score = 0;
    scoreElem.innerHTML = 0;
    getStoredData();
    bestResElem.innerHTML = bestResultСurrent.value;
    if (!isMute) { startAudio.play(); }
    isGameOver = false;
    generatePlayField();
    generateTetromino();
    cells = document.querySelectorAll('.tetris-field div');
    moveDown();
};

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
};

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
};

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
    scoreElem.innerHTML = score;
};
//створення ігрового поля фігури і розміщення
function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement(`div`);
        playFieldElem.append(div);
    }
    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
};

function generateTetromino() {
    let name;
    if (nextTetrominoName === null) {
        name = getRandomElement(TETROMINO_NAMES);
    } else {
        name = nextTetrominoName;
    }
    // const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    const rowTetro = -2;
    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: column
    }
    generateNextTetromino();
};

// генерує попередній перегляд наступної фігури, та зберігає її для рендеру на ігровому полі
function generateNextTetromino() {
    nextTetrominoName = getRandomElement(TETROMINO_NAMES);
    nextTetroImg.src = `./img/${nextTetrominoName}.jpg`;
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (isOutsideOfTopboard(row)) {
                isGameOver = true;
                return;
            }
            if (tetromino.matrix[row][column]) {
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }
    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino();
    countScore(filledRows.length);
    if (!isMute) { putAudio.play(); }
};

// згорання ліній
function removeFillRows(filledRows) {
    for (let i = 0; i < filledRows.length; i++) {
        const row = filledRows[i];
        dropRowsAbove(row);
        if (!isMute) { deleteAudio.play(); }
        speed -= 10;
    }
};

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfield[row] = playfield[row - 1];
    }
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
};

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
};


// малюємо поле
function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] == 0) continue;

            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
};
// малюємо фігуру
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
// перемальовка, виклик функцій drawPlayField і drawTetromino
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
    if (!isMute) { rotateAudio.play(); }
    rotateTetromino();
    draw();
}

function onKeyDown(e) {
    if (e.key == ' ') {
        e.preventDefault();
        // якщо якась кнопка була клікнута тобто стає активна, то повторне відтворення дії цієї кнопки, натисненням пробілу буде заборонений для неї
    }
    if (e.code == 'KeyP' && !isPaused) {
        togglePauseGame();
        modalPause.showModal();
    } else if (e.code == 'KeyP' && isPaused || e.key == 'Escape' && isPaused) {
        togglePauseGame();
        modalPause.close();
    }
    if (e.key == 'Escape' && isGameOver) {
        restartGame();
    }
    if (!isPaused && !isGameOver) {
        switch (e.key) {
            case ' ':
                dropTetrominoDown();
                break;
            case 'ArrowUp':
                rotate();
                break;
            case 'ArrowDown':
                if (!isMute) { moveAudio.play(); }
                moveTetrominoDown();
                break;
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
        }
    }
    draw();
};

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
};

function moveTetrominoDown() {
    tetromino.row += 1;
    if (!isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }
};

function dropTetrominoDown() {
    while (isValid()) {
        tetromino.row += 1;
    }
    tetromino.row -= 1;
};

function moveTetrominoLeft() {
    if (!isMute) { moveAudio.play(); }
    tetromino.column -= 1;
    if (!isValid()) {
        tetromino.column += 1;
    }
};

function moveTetrominoRight() {
    if (!isMute) { moveAudio.play(); }
    tetromino.column += 1;
    if (!isValid()) {
        tetromino.column -= 1;
    }
};

// automatic tetromino movement down
function moveDown() {
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if (isGameOver) {
        gameOver();
    }
};

function gameOver() {
    if (!isMute) { gameOverAudio.play(); }
    stopLoop();
    modalScoreElem.innerHTML = score;
    modalbestResElem.innerHTML = bestResultСurrent.value + ' ' + bestResultСurrent.name;
    isInputShow();
    modalGameOver.showModal();
};

function startLoop() {
    if (!timedId) {
        timedId = setTimeout(() => { requestAnimationFrame(moveDown) }, speed)
    }
};

function stopLoop() {
    cancelAnimationFrame(timedId);
    clearTimeout(timedId);
    timedId = null;
};

function togglePauseGame() {
    if (isPaused === false) {
        stopLoop();
    } else {
        startLoop();
    }
    isPaused = !isPaused;
}

function onBtnLevelClick(event) {
    const btn = event.currentTarget;
    switch (true) {
        case btn.classList.contains('btn-easy'):
            TETROMINO_NAMES = [...TETROMINOES_NAMES_MEDIUM, ...TETROMINOES_NAMES_EASY];
            TETROMINOES = { ...TETROMINOES_MEDIUM, ...TETROMINOES_EASY };
            level = 'easy';
            break;
        case btn.classList.contains('btn-medium'):
            TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
            TETROMINOES = TETROMINOES_MEDIUM;
            level = 'medium';
            break;
        case btn.classList.contains('btn-hard'):
            TETROMINO_NAMES = [...TETROMINOES_NAMES_MEDIUM, ...TETROMINOES_NAMES_HARD];
            TETROMINOES = { ...TETROMINOES_MEDIUM, ...TETROMINOES_HARD };
            level = 'hard';
            break;
        default:
            TETROMINO_NAMES = TETROMINOES_NAMES_MEDIUM;
            TETROMINOES = TETROMINOES_MEDIUM;
            level = 'medium';
    };
    restartGame();
};

function onBtnGameStateClick(event) {
    const btn = event.currentTarget;
    switch (true) {
        case btn.classList.contains('btn-pause'):
            togglePauseGame();
            modalPause.showModal();
            break;
        case btn.classList.contains('btn-restart'):
            restartGame();
            break;
    };
};

function onBtnControlClick(event) {
    const btn = event.currentTarget;
    if (!isPaused) {
        switch (true) {
            case btn.classList.contains('btn-rotate'):
                rotate();
                break;
            case btn.classList.contains('btn-left'):
                moveTetrominoLeft();
                break;
            case btn.classList.contains('btn-down'):
                if (!isMute) { moveAudio.play(); }
                moveTetrominoDown();
                break;
            case btn.classList.contains('btn-right'):
                moveTetrominoRight()
                break;
            case btn.classList.contains('btn-drop-down'):
                dropTetrominoDown()
                break;
        }
    };
    draw();
};

function onContinueBtnClick() {
    modalPause.close();
    togglePauseGame();
}

function onModalRestartBtnClick() {
    modalGameOver.close();
    bestResultSaver();
    restartGame();
    formFieldElem.style.display = 'none';
}

function restartGame() {
    playFieldElem.innerHTML = '';
    init();
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

// вираховування та збереження найкращого результату гри
function bestResultSaver() {
    if (score > bestResultСurrent.value) {
        bestResultСurrent.value = score;
        bestResultСurrent.name = inputElem.value || 'anonymous';
        switch (level) {
            case 'easy':
                bestResultEasy.value = bestResultСurrent.value;
                bestResultEasy.name = bestResultСurrent.name;
                localStorage.setItem(BEST_RESULT_EASY_KEY, JSON.stringify(bestResultEasy));
                break;
            case 'medium':
                bestResultMedium.value = bestResultСurrent.value;
                bestResultMedium.name = bestResultСurrent.name;
                localStorage.setItem(BEST_RESULT_MEDIUM_KEY, JSON.stringify(bestResultMedium));
                break;
            case 'hard':
                bestResultHard.value = bestResultСurrent.value;
                bestResultHard.name = bestResultСurrent.name;
                localStorage.setItem(BEST_RESULT_HARD_KEY, JSON.stringify(bestResultHard));
                break;
        }
    }
    inputElem.value = '';
}


// чи показувати поле для введення імені гравця з найкращим результатом
function isInputShow() {
    if (score > bestResultСurrent.value) {
        formFieldElem.style.display = 'block';
    }
}

// отримуємо найкращий результат з local Storage
function getStoredData() {
    let storedData;
    switch (level) {
        case 'easy':
            storedData = JSON.parse(localStorage.getItem(BEST_RESULT_EASY_KEY));
            break;
        case 'medium':
            storedData = JSON.parse(localStorage.getItem(BEST_RESULT_MEDIUM_KEY));
            break;
        case 'hard':
            storedData = JSON.parse(localStorage.getItem(BEST_RESULT_HARD_KEY));
            break;
    }

    if (storedData === null) {
        bestResultСurrent.value = 0;
        bestResultСurrent.name = ' ';
    } else {
        bestResultСurrent.value = storedData.value;
        bestResultСurrent.name = storedData.name;
    }

    const storedMute = JSON.parse(localStorage.getItem(MUTE_KEY));
    if (storedMute === null) {
        isMute = false;
        muteBtnValue.innerHTML = 'Off';
    } else {
        isMute = storedMute;
        if (isMute) {
            muteBtnValue.innerHTML = 'On';
        } else {
            muteBtnValue.innerHTML = 'Off';
        }
    }

}

// перемикач значення "чи вімкнений звук"
function onMuteBtnClick() {
    isMute = !isMute;
    if (isMute) {
        muteBtnValue.innerHTML = 'On';
        muteBtn.classList.add('active');
        startAudio.pause();
        gameOverAudio.pause();
        rotateAudio.pause();
        moveAudio.pause();
        putAudio.pause();
        deleteAudio.pause();
    } else if (!isMute) {
        muteBtnValue.innerHTML = 'Off';
        muteBtn.classList.remove('active');
    }
    localStorage.setItem(MUTE_KEY, JSON.stringify(isMute));
}
