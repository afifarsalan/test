const cursor = document.querySelector('.custom-cursor');
let timeout;
let isMoving = false;

function updateCursorPosition(x, y) {
  cursor.style.transform = `translate(${x}px, ${y}px)`;
  
  // Cek elemen yang di-hover/touch
  const element = document.elementFromPoint(x, y);
  if (element) {
    const computedStyle = window.getComputedStyle(element);
    cursor.classList.toggle('hover', computedStyle.cursor === 'pointer');
  }
}

function handleCursorActivity() {
  clearTimeout(timeout);
  cursor.classList.remove('fade');
  
  timeout = setTimeout(() => {
    cursor.classList.add('fade');
  }, 5000);
}

// Mouse handling
document.addEventListener('mousemove', (e) => {
  if (!isMoving) {
    isMoving = true;
    requestAnimationFrame(() => {
      updateCursorPosition(e.clientX, e.clientY);
      handleCursorActivity();
      isMoving = false;
    });
  }
});

// Touch handling
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const x = touch.pageX - window.scrollX;
  const y = touch.pageY - window.scrollY;
  
  if (!isMoving) {
    isMoving = true;
    requestAnimationFrame(() => {
      updateCursorPosition(x, y);
      handleCursorActivity();
      isMoving = false;
    });
  }
  
  e.preventDefault();
});

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  updateCursorPosition(
    touch.pageX - window.scrollX,
    touch.pageY - window.scrollY
  );
  handleCursorActivity();
});

// Reset cursor on interaction
['click', 'touchstart'].forEach(event => {
  document.addEventListener(event, handleCursorActivity);
});

// Ensure cursor works with scroll
document.addEventListener('scroll', () => {
  cursor.style.pointerEvents = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('networkContainer');
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  let mouse = {
      x: null,
      y: null,
      radius: 75,
      mode: 'collect', // Modes: 'collect' or 'disperse'
      startTime: Date.now()
  };

  container.addEventListener('mousemove', function(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
  });

  class Node {
      constructor(x, y, size) {
          this.x = x;
          this.y = y;
          this.size = size;
          this.baseX = x;
          this.baseY = y;
          this.dx = (Math.random() * 2) - 1;
          this.dy = (Math.random() * 2) - 1;
      }

      draw() {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
      }

      update() {
          if (this.x + this.size > canvas.width || this.x - this.size < 0) {
              this.dx *= -1;
          }

          if (this.y + this.size > canvas.height || this.y - this.size < 0) {
              this.dy *= -1;
          }

          this.x += this.dx;
          this.y += this.dy;

          if (mouse.mode === 'collect') {
              let dx = mouse.x - this.x;
              let dy = mouse.y - this.y;
              let distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < mouse.radius) {
                  let angle = Math.atan2(dy, dx);
                  let tx = mouse.x + Math.cos(angle) * mouse.radius;
                  let ty = mouse.y + Math.sin(angle) * mouse.radius;

                  this.dx = (tx - this.x) * 0.1;
                  this.dy = (ty - this.y) * 0.1;
              }
          } else if (mouse.mode === 'disperse') {
              let dx = this.x - mouse.x;
              let dy = this.y - mouse.y;
              let distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < mouse.radius * 2) {
                  let angle = Math.atan2(dy, dx);
                  let tx = mouse.x + Math.cos(angle) * (mouse.radius * 2);
                  let ty = mouse.y + Math.sin(angle) * (mouse.radius * 2);

                  this.dx = (tx - this.x) * 0.1;
                  this.dy = (ty - this.y) * 0.1;
              }
          }

          // Ensure the nodes keep moving by adding a small random value
          this.dx += (Math.random() * 0.1) - 0.05;
          this.dy += (Math.random() * 0.1) - 0.05;
      }
  }

  function createNodes() {
      let nodes = [];
      for (let i = 0; i < 100; i++) {
          let size = 1;
          let x = Math.random() * (canvas.width - size * 2) + size;
          let y = Math.random() * (canvas.height - size * 2) + size;
          nodes.push(new Node(x, y, size));
      }
      return nodes;
  }

  let nodes = createNodes();

  function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(node => {
          node.draw();
          node.update();
      });
      connectNodes();
      handleModes();
      requestAnimationFrame(animate);
  }

  function connectNodes() {
      for (let a = 0; a < nodes.length; a++) {
          for (let b = a; b < nodes.length; b++) {
              let dx = nodes[a].x - nodes[b].x;
              let dy = nodes[a].y - nodes[b].y;
              let distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 100) {
                  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(nodes[a].x, nodes[a].y);
                  ctx.lineTo(nodes[b].x, nodes[b].y);
                  ctx.stroke();
              }
          }
      }
  }

  function handleModes() {
      let currentTime = Date.now();
      if (mouse.mode === 'collect' && currentTime - mouse.startTime > 10000) {
          mouse.mode = 'disperse';
          mouse.startTime = currentTime;
      } else if (mouse.mode === 'disperse' && currentTime - mouse.startTime > 7500) {
          mouse.mode = 'collect';
          mouse.startTime = currentTime;
      }
  }

  animate();

  const textElement = document.getElementById('ketik');
  const text = "Halo! Saya Afif, seorang siswa SMK yang tertarik dengan dunia programming dan robotika.";
  let index = 0;
  
  function typeWriter() {
      if (index < text.length) {
          textElement.textContent += text.charAt(index);
          index++;
          setTimeout(typeWriter, 50); // Kecepatan mengetik (ms)
      }
  }
  
  typeWriter();
});
