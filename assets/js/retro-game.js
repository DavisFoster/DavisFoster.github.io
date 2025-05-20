(function() {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1000';
  canvas.style.pointerEvents = 'none';

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let shipX = canvas.width / 2;
  const shipY = canvas.height - 40;
  const shipWidth = 20;
  const shipHeight = 20;
  const bullets = [];
  let leftPressed = false;
  let rightPressed = false;

  document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') leftPressed = true;
    if (e.code === 'ArrowRight') rightPressed = true;
    if (e.code === 'Space') {
      bullets.push({ x: shipX, y: shipY - shipHeight / 2 });
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') leftPressed = false;
    if (e.code === 'ArrowRight') rightPressed = false;
  });

  function destroyCharacterAt(x, y) {
    let range;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
      }
    }

    if (range) {
      const node = range.startContainer;
      const offset = range.startOffset;
      if (node && node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue.slice(0, offset) + node.nodeValue.slice(offset + 1);
        return true;
      }
    }

    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      if (el === canvas || el.tagName === 'BODY' || el.contains(canvas)) continue;
      if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
        el.firstChild.nodeValue = el.firstChild.nodeValue.substring(1);
      } else {
        el.style.visibility = 'hidden';
      }
      return true;
    }
    return false;
  }

  function update() {
    if (leftPressed) {
      shipX -= 5;
      destroyCharacterAt(shipX, shipY);
    }
    if (rightPressed) {
      shipX += 5;
      destroyCharacterAt(shipX, shipY);
    }
    shipX = Math.max(shipWidth / 2, Math.min(canvas.width - shipWidth / 2, shipX));

    bullets.forEach((b, i) => {
      b.y -= 7;
      if (destroyCharacterAt(b.x, b.y) || b.y < 0) {
        bullets.splice(i, 1);
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.fillRect(shipX - shipWidth / 2, shipY - shipHeight / 2, shipWidth, shipHeight);
    ctx.fillStyle = '#ff0';
    bullets.forEach(b => {
      ctx.fillRect(b.x - 2, b.y - 10, 4, 10);
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
})();
