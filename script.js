const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const speedEl = document.getElementById('speed');

const game = {
  width: canvas.width,
  height: canvas.height,
  running: false,
  score: 0,
  level: 1,
  speed: 3,
  keys: {},
  player: { x: 205, y: 520, w: 70, h: 110 },
  obstacles: [],
  coins: [],
  laneX: [150, 270],
  frame: 0,
};

function resetGame() {
  game.running = false;
  game.score = 0;
  game.level = 1;
  game.speed = 3;
  game.player.x = 205;
  game.player.y = 520;
  game.obstacles = [];
  game.coins = [];
  game.frame = 0;
  updateHud();
  overlay.querySelector('h2').textContent = 'Press ENTER to start';
  overlay.style.display = 'grid';
}

function startGame() {
  game.running = true;
  overlay.style.display = 'none';
  game.obstacles = [];
  game.coins = [];
  game.frame = 0;
  requestAnimationFrame(gameLoop);
}

function updateHud() {
  scoreEl.textContent = game.score;
  levelEl.textContent = game.level;
  speedEl.textContent = game.speed;
}

function createObstacle() {
  const lane = game.laneX[Math.floor(Math.random() * game.laneX.length)];
  const obstacle = { x: lane, y: -140, w: 70, h: 130 };
  game.obstacles.push(obstacle);
}

function createCoin() {
  const lane = game.laneX[Math.floor(Math.random() * game.laneX.length)];
  const coin = { x: lane + 22, y: -100, r: 12, value: 10 };
  game.coins.push(coin);
}

function drawRoad() {
  ctx.fillStyle = '#0c0f16';
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.fillStyle = '#141924';
  ctx.fillRect(110, 0, 260, game.height);

  ctx.strokeStyle = '#3b4d7c';
  ctx.lineWidth = 14;
  ctx.setLineDash([24, 22]);
  ctx.beginPath();
  ctx.moveTo(110, 0);
  ctx.lineTo(110, game.height);
  ctx.moveTo(370, 0);
  ctx.lineTo(370, game.height);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#7e9ddf';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(240, -game.frame * 0.8 % 80);
  for (let y = -80; y < game.height + 80; y += 80) {
    ctx.moveTo(240, y + (game.frame * 0.8 % 80));
    ctx.lineTo(240, y + 40 + (game.frame * 0.8 % 80));
  }
  ctx.stroke();
}

function drawPlayer() {
  ctx.fillStyle = '#3d7fff';
  ctx.fillRect(game.player.x, game.player.y, game.player.w, game.player.h);
  ctx.strokeStyle = '#8ab8ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(game.player.x, game.player.y, game.player.w, game.player.h);
}

function drawObstacles() {
  game.obstacles.forEach(obs => {
    ctx.fillStyle = '#d33c45';
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    ctx.fillStyle = '#ffb3b9';
    ctx.fillRect(obs.x + 10, obs.y + 12, obs.w - 20, obs.h - 24);
  });
}

function drawCoins() {
  game.coins.forEach(coin => {
    ctx.beginPath();
    ctx.fillStyle = '#ffd45b';
    ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffec99';
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

function moveEntities(delta) {
  const moveDist = game.speed * delta;
  game.obstacles.forEach(obs => obs.y += moveDist);
  game.coins.forEach(coin => coin.y += moveDist);
}

function clampPlayer() {
  if (game.player.x < 120) game.player.x = 120;
  if (game.player.x + game.player.w > 360) game.player.x = 360 - game.player.w;
  if (game.player.y < 0) game.player.y = 0;
  if (game.player.y + game.player.h > game.height) game.player.y = game.height - game.player.h;
}

function handleInput(delta) {
  const speed = 250 * delta;
  if (game.keys.ArrowLeft) game.player.x -= speed;
  if (game.keys.ArrowRight) game.player.x += speed;
  if (game.keys.ArrowUp) game.player.y -= speed;
  if (game.keys.ArrowDown) game.player.y += speed;
  clampPlayer();
}

function checkCollision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function checkCoinCollision(coin) {
  const dx = (coin.x) - (game.player.x + game.player.w / 2);
  const dy = coin.y - (game.player.y + game.player.h / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < coin.r + Math.min(game.player.w, game.player.h) / 2 - 8;
}

function collectCoins() {
  game.coins = game.coins.filter(coin => {
    if (checkCoinCollision(coin)) {
      game.score += coin.value;
      return false;
    }
    return true;
  });
}

function updateEntities(delta) {
  if (game.frame % 60 === 0) createObstacle();
  if (game.frame % 120 === 0) createCoin();
  moveEntities(delta);
  game.obstacles = game.obstacles.filter(obs => obs.y < game.height + obs.h);
  game.coins = game.coins.filter(coin => coin.y < game.height + coin.r);
  collectCoins();
}

function checkGameOver() {
  for (const obs of game.obstacles) {
    if (checkCollision(game.player, obs)) {
      game.running = false;
      overlay.querySelector('h2').textContent = 'Game Over — Press ENTER to restart';
      overlay.style.display = 'grid';
      return;
    }
  }
}

function updateSpeedAndLevel() {
  const nextLevel = Math.floor(game.score / 100) + 1;
  if (nextLevel !== game.level) {
    game.level = nextLevel;
    game.speed = 3 + game.level * 0.8;
  }
}

let lastTime = 0;
function gameLoop(timestamp) {
  if (!game.running) return;
  const delta = Math.min((timestamp - lastTime) / 1000, 0.033);
  lastTime = timestamp;

  game.frame += 1;
  handleInput(delta);
  updateEntities(delta);
  checkGameOver();
  updateSpeedAndLevel();
  updateHud();

  drawRoad();
  drawPlayer();
  drawObstacles();
  drawCoins();

  if (game.running) requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
  game.keys[event.key] = true;
  if (event.key === 'Enter' && !game.running) {
    startGame();
    lastTime = performance.now();
  }
});

window.addEventListener('keyup', (event) => {
  game.keys[event.key] = false;
});

resetGame();
