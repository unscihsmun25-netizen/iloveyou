var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var stars = 500;
var colorrange = [0, 60, 240];
var starArray = [];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize stars with random opacity values
for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    var y = Math.random() * canvas.offsetHeight;
    var radius = Math.random() * 1.2;
    var hue = colorrange[getRandom(0, colorrange.length - 1)];
    var sat = getRandom(50, 100);
    var opacity = Math.random();
    starArray.push({ x, y, radius, hue, sat, opacity });
}

var frameNumber = 0;
var opacity = 0;
var secondOpacity = 0;
var thirdOpacity = 0;

var baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);

// Poem animation state
var poemStarted = false;
var poemEnded = false;
var poemHearts = [];
var starExplosionStartTime = null;
var starExplosionDuration = 2000; // 2 seconds for explosion
var typewriterStartTime = null;
var typewriterText = "i love you so much.";
var typewriterIndex = 0;
var typewriterSpeed = 150; // milliseconds per character

// Pulsating heart class
class PulsatingHeart {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 15 + 10;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
    }
    
    update() {
        this.pulse += this.pulseSpeed;
    }
    
    draw(ctx) {
        const scale = 0.8 + Math.sin(this.pulse) * 0.2;
        const alpha = 0.3 + Math.sin(this.pulse) * 0.2;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        
        ctx.font = this.size + 'px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤍', 0, 0);
        
        ctx.restore();
    }
}

// Initialize pulsating hearts
function initPoemHearts() {
    poemHearts = [];
    for (let i = 0; i < 8; i++) {
        poemHearts.push(new PulsatingHeart());
    }
}

function updateStars() {
    for (var i = 0; i < stars; i++) {
        if (Math.random() > 0.99) {
            starArray[i].opacity = Math.random();
        }
    }
}

const button = document.getElementById("valentinesButton");

// Function to create a single heart
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💗';
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 30 + 20 + 'px';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all ' + (Math.random() * 3 + 3) + 's ease-out';
    
    document.body.appendChild(heart);
    
    // Animate heart upward
    setTimeout(() => {
        heart.style.top = '-100px';
        heart.style.left = (parseFloat(heart.style.left) + (Math.random() - 0.5) * 200) + 'px';
        heart.style.opacity = '0';
        heart.style.transform = 'rotate(' + (Math.random() * 360) + 'deg) scale(' + (Math.random() * 2) + ')';
    }, 10);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 6000);
}

button.addEventListener("click", () => {
  if (button.textContent === "yes (i love you azza)") {
    button.style.display = "none";
    
    // Play the song with fade in
    const song = document.getElementById('loveSong');
    song.volume = 0;
    
    // Try to play with error handling
    const playPromise = song.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Autoplay started - fade in the music over 3 seconds
            let fadeInInterval = setInterval(() => {
                if (song.volume < 0.95) {
                    song.volume = Math.min(song.volume + 0.05, 1);
                } else {
                    song.volume = 1;
                    clearInterval(fadeInInterval);
                }
            }, 150);
        }).catch(error => {
            // Autoplay was prevented - play at full volume instead
            console.log("Autoplay prevented, playing at full volume");
            song.volume = 1;
            song.play();
        });
    }
    
    // Show the couple photo
    const photo = document.getElementById('couplePhoto');
    photo.style.display = "block";
    setTimeout(() => {
        photo.style.opacity = "1";
        photo.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
    
    // After 5 seconds, dim the screen and start poem
    setTimeout(() => {
        const dimOverlay = document.getElementById('dimOverlay');
        dimOverlay.classList.add('active');
        
        // Dim the photo along with background
        photo.style.filter = 'brightness(0.4)';
        
        // Start poem credits scrolling after dimming
        setTimeout(() => {
            const poem = document.getElementById('poemCredits');
            poem.classList.add('scrolling');
            poemStarted = true;
            initPoemHearts();
            
            // Poem ends after 45 seconds (matching the animation duration)
            setTimeout(() => {
                poemEnded = true;
                starExplosionStartTime = Date.now();
                
                // Start typewriter after explosion finishes
                setTimeout(() => {
                    typewriterStartTime = Date.now();
                }, starExplosionDuration);
                
            }, 45000);
        }, 500);
        
        // Fade out music after 35 seconds (before poem ends)
        setTimeout(() => {
            let fadeOutInterval = setInterval(() => {
                if (song.volume > 0.05) {
                    song.volume = Math.max(song.volume - 0.05, 0);
                } else {
                    song.volume = 0;
                    clearInterval(fadeOutInterval);
                    song.pause();
                }
            }, 150);
        }, 35000);
        
    }, 5000);
    
    // Create waves of hearts
    for (let wave = 0; wave < 15; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createFloatingHeart();
                }, i * 15);
            }
        }, wave * 150);
    }
  }
});

function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
    lines.forEach((line, index) => {
        context.fillText(line, x, y + index * (fontSize + lineHeight));
    });
}

function drawText() {
    var fontSize = Math.min(30, window.innerWidth / 24); // Adjust font size based on screen width
    var lineHeight = 8;

    context.font = fontSize + "px Quicksand";
    context.textAlign = "center";
    
    // glow effect
    context.shadowColor = "rgba(154, 113, 151, 1)";
    context.shadowBlur = 8;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    if(frameNumber < 250){
        context.fillStyle = `rgba(154, 113, 151, ${opacity})`;
        context.fillText("everyday I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    //fades out the text by decreasing the opacity
    if(frameNumber >= 250 && frameNumber < 500){
        context.fillStyle = `rgba(154, 113, 151, ${opacity})`;
        context.fillText("everyday I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    //needs this if statement to reset the opacity before next statement on canvas
    if(frameNumber == 500){
        opacity = 0;
    }
    if(frameNumber > 500 && frameNumber < 750){
        context.fillStyle = `rgba(237, 240, 218, ${opacity})`;

        if (window.innerWidth < 600) {           //shortens long sentence for mobile screens
            drawTextWithLineBreaks(["amongst trillions and trillions of stars,", "over billions of years"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 750 && frameNumber < 1000){
        context.fillStyle = `rgba(237, 240, 218, ${opacity})`;
        
        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["amongst trillions and trillions of stars,", "over billions of years"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity - 0.01;
    }

    if(frameNumber == 1000){
        opacity = 0;
    }
    if(frameNumber > 1000 && frameNumber < 1250){
        context.fillStyle = `rgba(154, 113, 151, ${opacity})`;
        context.fillText("to be alive and to get to be with you my vave", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1250 && frameNumber < 1500){
        context.fillStyle = `rgba(154, 113, 151, ${opacity})`;
        context.fillText("to be alive and to get to be with you my vave", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 1500){
        opacity = 0;
    }
    if(frameNumber > 1500 && frameNumber < 1750){
        context.fillStyle = `rgba(237, 240, 218, ${opacity})`;
        context.fillText("to me it still is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1750 && frameNumber < 2000){
        context.fillStyle = `rgba(237, 240, 218, ${opacity})`;
        context.fillText("to me it still is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2000){
        opacity = 0;
    }
    if(frameNumber > 2000 && frameNumber < 2250){
        context.fillStyle = `rgba(154, 113, 151, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and yet here I am to get the impossible", "chance to get to know, love and be with you"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("and yet here I am to get the impossible chance to get to know, love and be with you", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 2250 && frameNumber < 2500){
        context.fillStyle = `rgba(154, 113, 151, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and yet here I am to get the impossible", "chance to get to know, love and be with you"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("and yet here I am to get the impossible chance to get to know, love and be with you", canvas.width/2, canvas.height/2);
        }
        
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2500){
        opacity = 0;
    }
    if(frameNumber > 2500 && frameNumber < 99999){
        context.fillStyle = `rgba(237, 240, 218, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["I love you so much azza, more than", "all the time and space the universe can contain"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("I love you so much azza, more than all the time and space the universe can contain", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    
    if(frameNumber >= 2750 && frameNumber < 99999){
        context.fillStyle = `rgba(154, 113, 151, ${secondOpacity})`;


        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and I can't wait to spend all the time in", "the world to share my love with you"], canvas.width / 2, (canvas.height/2 + 60), fontSize, lineHeight);
        } else {
            context.fillText("and I can't wait to spend all the time in the world to share my love with you", canvas.width/2, (canvas.height/2 + 50));
        }

        secondOpacity = secondOpacity + 0.01;
    }

    if(frameNumber >= 3000 && frameNumber < 99999){
        context.fillStyle = `rgba(237, 240, 218, ${thirdOpacity})`;
        context.fillText("will you be my valentine? <3", canvas.width/2, (canvas.height/2 + 120));
        thirdOpacity = thirdOpacity + 0.01;

        button.style.display = "block";
    }   

     // Reset the shadow effect after drawing the text
     context.shadowColor = "transparent";
     context.shadowBlur = 0;
     context.shadowOffsetX = 0;
     context.shadowOffsetY = 0;
}

function drawPoemHearts() {
    if (poemStarted && !poemEnded) {
        poemHearts.forEach(heart => {
            heart.update();
            heart.draw(context);
        });
    }
}

function drawStarExplosion() {
    if (!starExplosionStartTime) return;
    
    const elapsed = Date.now() - starExplosionStartTime;
    const progress = Math.min(elapsed / starExplosionDuration, 1);
    
    // Pick a star to expand (use the first one)
    const expandingStar = starArray[0];
    
    // Exponential growth
    const maxRadius = Math.max(canvas.width, canvas.height) * 1.5;
    const currentRadius = progress * maxRadius;
    
    // White color with increasing opacity
    const whiteOpacity = progress;
    
    context.save();
    context.globalAlpha = whiteOpacity;
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(expandingStar.x, expandingStar.y, currentRadius, 0, Math.PI * 2);
    context.fill();
    context.restore();
}

function drawTypewriter() {
    if (!typewriterStartTime) return;
    
    const elapsed = Date.now() - typewriterStartTime;
    const currentIndex = Math.floor(elapsed / typewriterSpeed);
    
    if (currentIndex <= typewriterText.length) {
        const displayText = typewriterText.substring(0, currentIndex);
        
        context.save();
        context.font = Math.min(30, window.innerWidth / 24) + "px Quicksand";
        context.fillStyle = '#36454F'; // Charcoal color
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(displayText, canvas.width / 2, canvas.height / 2);
        context.restore();
    }
}

function draw() {
    context.putImageData(baseFrame, 0, 0);

    // Only draw stars if explosion hasn't started
    if (!starExplosionStartTime) {
        drawStars();
        updateStars();
        drawText();
        drawPoemHearts();
    } else {
        // During and after explosion
        drawStarExplosion();
        
        // After explosion is complete, show typewriter on white background
        const elapsed = starExplosionStartTime ? Date.now() - starExplosionStartTime : 0;
        if (elapsed >= starExplosionDuration) {
            // Fill with white
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            drawTypewriter();
        }
    }

    if (frameNumber < 99999) {
        frameNumber++;
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
});

window.requestAnimationFrame(draw);
