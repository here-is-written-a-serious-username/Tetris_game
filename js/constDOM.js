const playFieldElem = document.querySelector('.tetris-field');
const scoreElem = document.querySelector('.score-value');
const bestResElem = document.querySelector('.best-result-value');
const nextTetroImg = document.querySelector('.next-tetro-img');
const muteBtn = document.querySelector('.btn-mute');
const muteBtnValue = document.querySelector('.btn-mute-value');

const modalScoreElem = document.querySelector('.modal-game-over__result-value');
const modalbestResElem = document.querySelector('.modal-game-over__best-result-value');
const modalPause = document.getElementById("modal-pause");
const continueBtn = document.querySelector(".modal-pause__continue-btn");
const modalGameOver = document.getElementById("modal-game-over");
const modalRestartBtn = document.querySelector(".modal-game-over__restart-btn");

const formFieldElem = document.querySelector(".form__field");
const inputElem = document.querySelector(".form__input");


export {
    playFieldElem, scoreElem, bestResElem, muteBtn, muteBtnValue, modalScoreElem, modalbestResElem, modalPause, continueBtn, modalGameOver, modalRestartBtn,
    formFieldElem, inputElem, nextTetroImg
}