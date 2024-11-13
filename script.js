const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

let isJumping = false;
let gravity = 0.9;
let position = 0;
let playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;

let platforms = [];

// Funkce pro vytvoření plošiny
function createPlatform(y) {
    const platform = document.createElement("div");
    platform.classList.add("platform");
    platform.style.left = `${Math.random() * (gameArea.offsetWidth - 60)}px`;
    platform.style.bottom = `${y}px`;
    gameArea.appendChild(platform);
    platforms.push(platform);
}

// Generování plošin
for (let i = 0; i < 5; i++) {
    createPlatform(i * 100);
}

// Pohyb hráče
function jump() {
    if (isJumping) return;
    isJumping = true;

    let upInterval = setInterval(() => {
        if (position >= 150) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 5;
                    position *= gravity;
                    player.style.bottom = position + "px";

                    // Kontrola kontaktu hráče s plošinou
                    platforms.forEach(platform => {
                        let platformRect = platform.getBoundingClientRect();
                        let playerRect = player.getBoundingClientRect();

                        if (
                            playerRect.left < platformRect.right &&
                            playerRect.right > platformRect.left &&
                            playerRect.bottom >= platformRect.top &&
                            playerRect.bottom <= platformRect.top + 10 &&
                            position > 0
                        ) {
                            isJumping = false;
                            position = 1;
                        }
                    });
                }
            }, 20);
        } else {
            position += 20;
            player.style.bottom = position + "px";
        }
    }, 20);
}

// Pohyb plošin
function movePlatforms() {
    platforms.forEach(platform => {
        let platformBottom = parseInt(platform.style.bottom);
        platform.style.bottom = platformBottom + 2 + "px";

        if (platformBottom >= gameArea.offsetHeight) {
            platform.remove();
            platforms = platforms.filter(p => p !== platform);
            createPlatform(0);
        }
    });
}

// Spuštění pohybu plošin a poslech událostí
setInterval(movePlatforms, 20);
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});
