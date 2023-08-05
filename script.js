// Variables globales
let currentAngle = 0;
let cannonX = 0;
let cannonY = 0;

// Función para generar un número aleatorio en un rango dado
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Función para generar enemigos aleatoriamente y hacer que caigan del cielo
function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  document.body.appendChild(enemy);

  const startPositionX = randomInRange(0, window.innerWidth);
  const startPositionY = 0;
  const endPositionY = window.innerHeight + 50;
  const animationDuration = randomInRange(2000, 5000);

  enemy.style.left = `${startPositionX}px`;
  enemy.style.top = `${startPositionY}px`;

  // Animación del enemigo cayendo
  enemy.animate(
    [
      { top: `${startPositionY}px` },
      { top: `${endPositionY}px` },
    ],
    {
      duration: animationDuration,
      fill: "forwards",
    }
  ).onfinish = () => {
    document.body.removeChild(enemy);
  };
}

// Función para detectar colisiones entre elementos
function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right
  );
}

// Función para eliminar la bala y el enemigo en caso de colisión
function handleCollisions() {
  const cannonballs = document.querySelectorAll(".cannonball");
  const enemies = document.querySelectorAll(".enemy");

  cannonballs.forEach((cannonball) => {
    enemies.forEach((enemy) => {
      if (checkCollision(cannonball, enemy)) {
        document.body.removeChild(cannonball);
        document.body.removeChild(enemy);
      }
    });
  });
}

document.addEventListener("mousemove", (e) => {
  const cannon = document.getElementById("cannon");
  const mapContainer = document.querySelector(".map-container");
  const { left, top, width, height } = mapContainer.getBoundingClientRect();
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // Actualizamos la posición del cañón (necesario para el cálculo de la velocidad en fireCannon)
  cannonX = left + width / 2;
  cannonY = top + height;

  // Calculamos el ángulo entre el ratón y el centro del cañón
  const angle = Math.atan2(mouseX - cannonX, cannonY - mouseY) * (180 / Math.PI);

  // Limitamos el ángulo para que esté dentro del rango permitido (-80 a 80 grados)
  const maxRotation = 80;
  const minRotation = -80;
  currentAngle = Math.max(minRotation, Math.min(angle, maxRotation));

  cannon.style.transform = `rotate(${currentAngle}deg)`;
});

function fireCannon() {
  const cannonball = document.createElement("div");
  cannonball.classList.add("cannonball");
  document.body.appendChild(cannonball);

  const velocity = 100; // Ajusta la velocidad de la bola de cañón

  const angleRad = (currentAngle + 90) * (Math.PI / 180);
  const velocityX = -velocity * Math.cos(angleRad);
  const velocityY = -velocity * Math.sin(angleRad);

  let positionX = cannonX;
  let positionY = cannonY;

  // Animación del disparo
  const animationInterval = setInterval(() => {
    positionX += velocityX;
    positionY += velocityY;

    cannonball.style.left = `${positionX}px`;
    cannonball.style.top = `${positionY}px`;

    // Detectar colisiones
    handleCollisions();

    // Detener la animación cuando la bola de cañón salga de la pantalla
    if (positionY <= -20 || positionY >= window.innerHeight || positionX <= -20 || positionX >= window.innerWidth) {
      clearInterval(animationInterval);
      document.body.removeChild(cannonball);
    }
  }, 16);
}

document.addEventListener("click", () => {
  fireCannon();
});

// Animación inicial del cañón al cargar la página
const cannon = document.getElementById("cannon");
cannon.style.transform = "rotate(0deg)";

// Generar enemigos aleatoriamente cada 2 segundos
setInterval(() => {
  spawnEnemy();
}, 2000);
