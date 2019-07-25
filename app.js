const getImageAsset = ({ src, width, height, tileWidth, tileHeight }) =>
  new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.onload = () =>
      resolve({ image, width, height, tileWidth, tileHeight });
    image.src = "./assets/" + src;
  });

const gridSize = 16;
const zoomLevel = 4;
const canvasId = "viewport";
const boardWidth = 4;
const boardHeight = 4;

const play = async () => {
  const viewportNode = document.getElementById(canvasId);
  const ctx = viewportNode.getContext("2d");

  ctx.canvas.width = gridSize * boardWidth;
  ctx.canvas.height = gridSize * boardHeight;

  viewportNode.style.zoom = zoomLevel;

  const warriorSprite = await getImageAsset({
    src: "warrior.png",
    width: 256,
    height: 128,
    tileWidth: 12,
    tileHeight: 15
  });
  const wallSprite = await getImageAsset({
    src: "tiles0.png",
    width: 256,
    height: 64,
    tileWidth: 16,
    tileHeight: 16
  });
  const player = {
    x: Math.floor(boardWidth / 2),
    y: Math.floor(boardHeight / 2),
    path: [],
    currentState: "idle",
    states: {
      idle: {
        frames: [
          { src: warriorSprite, x: 1, y: 1 },
          { src: warriorSprite, x: 0, y: 1 }
        ],
        index: 0
      }
    }
  };
  const wall = {
    x: 1,
    y: 1,
    currentState: "standing",
    states: {
      standing: {
        frames: [{ src: wallSprite, x: 1, y: 1 }],
        index: 0
      }
    }
  };

  let totalTime = 0;
  const updatePlayer = player => {
    const state = player.states[player.currentState];
    const frame = state.frames[state.index];
    if (totalTime > 2000) {
      totalTime = totalTime - 2000;
      state.index = state.index + 1;
      if (state.index > state.frames.length - 1) {
        state.index = 0;
      }
    }
  };

  const objects = [wall, player];

  const tick = dTime => {
    // totalTime = totalTime + dTime;
    // const state = player.states[player.currentState];
    // const frame = state.frames[state.index];
    // if (totalTime > 2000) {
    //   totalTime = totalTime - 2000;
    //   state.index = state.index + 1;
    //   if (state.index > state.frames.length - 1) {
    //     state.index = 0;
    //   }
    // }

    objects.forEach(obj => {
      const state = obj.states[obj.currentState];
      const frame = state.frames[state.index];
      ctx.drawImage(
        frame.src.image,
        frame.x * frame.src.tileWidth,
        frame.y * frame.src.tileHeight,
        frame.src.tileWidth,
        frame.src.tileHeight,
        obj.x * gridSize + Math.floor((gridSize - frame.src.tileWidth) / 2),
        obj.y * gridSize + Math.floor((gridSize - frame.src.tileHeight) / 2),
        frame.src.tileWidth,
        frame.src.tileHeight
      );
    });
  };

  let lastPaintMoment = Date.now();

  const animate = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const now = Date.now();
    const dTime = now - lastPaintMoment;
    lastPaintMoment = now;

    tick(dTime);

    requestAnimationFrame(animate);
  };

  animate();

  // Listeners

  window.addEventListener("keyup", event => {
    const { key } = event;
    const actualPossition = {
      x: player.x,
      y: player.y
    };
    console.log(key);
    if (key === "ArrowDown") {
      player.y = player.y + 1;
    }
    if (key === "ArrowUp") {
      player.y = player.y - 1;
    }
    if (key === "ArrowRight") {
      player.x = player.x + 1;
    }
    if (key === "ArrowLeft") {
      player.x = player.x - 1;
    }
    if (player.x < 0 || player.x > boardWidth - 1) {
      player.x = actualPossition.x;
    }
    if (player.y < 0 || player.y > boardHeight - 1) {
      player.y = actualPossition.y;
    }
  });
};

play();
