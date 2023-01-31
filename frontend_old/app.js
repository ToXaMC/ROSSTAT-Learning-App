const ws = new WebSocket('ws://localhost:8000/ws');
let player = null;
let currentPlayer = null;
let gameOver = false;
const currentPlyerDisplay = document.getElementById('current-player');
const infoDisplay = document.getElementById('info');
const infoPlayer = document.getElementById('player');
const swapper = {
  X: 'O',
  O: 'X',
};
const checks = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

function highlightAll() {
  for (let c = 1; c < 10; c++) {
    document.getElementById(c).style.backgroundColor = 'gray';
  }
}

function hightLightRow() {
  let cells = [];
  for (let c = 1; c < 10; c++) {
    cells.push(document.getElementById(c));
  }
  checks.forEach(row => {
    console.log(row);
    if (
      cells[row[0]].innerHTML == cells[row[1]].innerHTML &&
      cells[row[0]].innerHTML == cells[row[2]].innerHTML &&
      cells[row[0]].innerHTML != ''
    ) {
      console.log(
        cells[row[0]].innerHTML,
        cells[row[1]].innerHTML,
        cells[row[2]].innerHTML
      );
      cells[row[0]].style.backgroundColor = 'var(--clr-win)';
      cells[row[1]].style.backgroundColor = 'var(--clr-win)';
      cells[row[2]].style.backgroundColor = 'var(--clr-win)';
      return;
    }
  });
}

function togglePlayer() {
  currentPlayer = swapper[currentPlayer];
  console.log('Toggler ', player, currentPlayer);
  if (player == currentPlayer) {
    infoDisplay.innerHTML = 'Your turn!';
    currentPlyerDisplay.innerHTML = player;
  } else {
    infoDisplay.innerHTML = "Your opponent's turn!";
    currentPlyerDisplay.innerHTML = swapper[player];
  }
}

function checkCell(cell) {
  if (cell.innerHTML == '' && player == currentPlayer) {
    return true;
  }
  return false;
}

function updateCell(id, sign) {
  const cell = document.getElementById(id);
  cell.innerHTML = sign;
}

function updateInfo(message) {
  infoDisplay.innerHTML = message;
}

function cellClick(id) {
  if (gameOver) {
    return;
  }
  const cell = document.getElementById(id);
  if (checkCell(cell)) {
    ws.send(JSON.stringify({ player, cell: id }));
  } else {
    infoDisplay.innerHTML = 'Choose another cell! Or wait for your turn!';
  }
}

ws.onmessage = function (e) {
  const response = JSON.parse(e.data);
  console.log('On message', response);
  if (response.init) {
    infoDisplay.innerHTML =
      'You play by: ' + response.player + '. ' + response.message;
    infoPlayer.innerHTML = response.player;
    if (response.message != 'Waiting for another player') {
      player = response.player;
    }
    currentPlayer = 'X';
    currentPlyerDisplay.innerHTML = 'X';
  } else {
    if (response.message == 'move') {
      updateCell(response.cell, response.player);
      togglePlayer();
    } else if (response.message == 'draw') {
      updateInfo("It's a draw");
      updateCell(response.cell, response.player);
      highlightAll();
      ws.close(1000);
    } else if (response.message == 'won') {
      updateInfo('Player ' + response.player + ' won!');
      updateCell(response.cell, response.player);
      hightLightRow();
      ws.close(1000);
    } else if (
      (response.player == player) &
      (response.message == 'choose another one')
    ) {
      updateInfo('Cell is not available');
    } else {
      console.log(response);
    }
  }
};

ws.onclose = function (e) {
  if (e.code == 4000) {
    infoDisplay.innerHTML = 'No more places!!';
  } else if (e.code != 1000) {
    infoDisplay.innerHTML = 'Error';
  }
  gameOver = true;
};
