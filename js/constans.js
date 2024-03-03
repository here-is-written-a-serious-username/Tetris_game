const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINOES_NAMES_EASY = [
    'dot',
    'shortStick',
    'middleStick',
];
const TETROMINOES_NAMES_MEDIUM = [
    'O',
    'J',
    'L',
    'I',
    'S',
    'T',
    'Z',
];
const TETROMINOES_NAMES_HARD = [
    'plus',
    'U',
    'SS',
    'ZZ',
];

const TETROMINOES_EASY = {
    'dot': [
        [1],
    ],
    'shortStick': [
        [0, 0, 0,],
        [1, 1, 0,],
        [0, 0, 0,],
    ],
    'middleStick': [
        [0, 0, 0,],
        [1, 1, 1,],
        [0, 0, 0,],
    ],
};
const TETROMINOES_MEDIUM = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
};
const TETROMINOES_HARD = {
    'plus': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    'U': [
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'SS': [
        [0, 1, 1],
        [0, 1, 0],
        [1, 1, 0],
    ],
    'ZZ': [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
};
const BEST_RESULT_EASY_KEY = 'BestResultEasy';
const BEST_RESULT_MEDIUM_KEY = 'BestResultMedium';
const BEST_RESULT_HARD_KEY = 'BestResultHard';
const MUTE_KEY = 'Mute';

export {
    PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETROMINOES_NAMES_EASY, TETROMINOES_NAMES_MEDIUM, TETROMINOES_NAMES_HARD,
    TETROMINOES_EASY, TETROMINOES_MEDIUM, TETROMINOES_HARD, BEST_RESULT_EASY_KEY, BEST_RESULT_MEDIUM_KEY, BEST_RESULT_HARD_KEY, MUTE_KEY
};