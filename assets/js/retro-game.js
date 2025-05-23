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
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
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

      // Look for a text node anywhere within the element.
      // Attempt to remove a single character from the first text node inside
      // the hit element. This prevents entire blocks from disappearing when
      // bullets collide with non-text elements.
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const textNode = walker.nextNode();
      if (textNode) {
        textNode.nodeValue = textNode.nodeValue.substring(1);
        return true;
      } else if (el.tagName === 'IMG') {
        // Non-textual targets like images should still disappear when hit.
        el.style.visibility = 'hidden';
        return true;
      }
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

  function drawShip() {
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(shipX, shipY - shipHeight); // nose
    ctx.lineTo(shipX - shipWidth, shipY + shipHeight); // left wing
    ctx.lineTo(shipX - shipWidth / 3, shipY + shipHeight / 2); // left inner
    ctx.lineTo(shipX + shipWidth / 3, shipY + shipHeight / 2); // right inner
    ctx.lineTo(shipX + shipWidth, shipY + shipHeight); // right wing
    ctx.closePath();
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
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
