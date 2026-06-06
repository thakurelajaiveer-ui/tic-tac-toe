let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameOver = false;

const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function makeMove(index) {
    if (board[index] === "" && !gameOver) {
        board[index] = human;
        updateBoard();

        if (!checkWinner(board)) {
            let bestMove = minimax(board, ai).index;
            board[bestMove] = ai;
            updateBoard();
            checkWinner(board);
        }
    }
}

function updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        cell.textContent = board[i];
    });
}

function checkWinner(boardState) {
    for (let combo of winCombos) {
        let [a, b, c] = combo;
        if (boardState[a] &&
            boardState[a] === boardState[b] &&
            boardState[a] === boardState[c]) {

            document.getElementById("status").innerText =
                boardState[a] === human ? "You Win! 🎉" : "AI Wins! 🤖";
            gameOver = true;
            return true;
        }
    }

    if (!boardState.includes("")) {
        document.getElementById("status").innerText = "Draw 😐";
        gameOver = true;
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let available = newBoard
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    if (checkWin(newBoard, human)) return { score: -10 };
    if (checkWin(newBoard, ai)) return { score: 10 };
    if (available.length === 0) return { score: 0 };

    let moves = [];

    for (let i of available) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === ai)
            move.score = minimax(newBoard, human).score;
        else
            move.score = minimax(newBoard, ai).score;

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === ai) {
        let bestScore = -1000;
        for (let m of moves) {
            if (m.score > bestScore) {
                bestScore = m.score;
                bestMove = m;
            }
        }
    } else {
        let bestScore = 1000;
        for (let m of moves) {
            if (m.score < bestScore) {
                bestScore = m.score;
                bestMove = m;
            }
        }
    }
    return bestMove;
}

function checkWin(board, player) {
    return winCombos.some(combo =>
        combo.every(i => board[i] === player)
    );
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    document.getElementById("status").innerText = "";
    updateBoard();
}