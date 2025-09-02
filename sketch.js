// Array that will store all particles
let particles1 = [];

// Total number of particles
let num = 10000;

// Variables for the microphone
let mic;
let vol;

function setup() {
    // Create the canvas with window width and height
    createCanvas(windowWidth, windowHeight);

    // Set black background
    background(0);

    // Initialize the particles
    for (let i = 0; i < num; i++) {
        // Create a 2D vector with a random position on the screen
        let p = createVector(random(width), random(height));
        // Store previous position to draw lines
        p.prevX = p.x;
        p.prevY = p.y;
        // Set particle life (frames) → 3 seconds at 60 fps
        p.life = 180;
        p.hue = random(360);
        // Add the particle to the array
        particles1.push(p);
    }

    // Set colors in HSB (Hue, Saturation, Brightness) with alpha
    colorMode(HSB, 360, 100, 100, 1);

    // Initialize the microphone to capture sound
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
    // Blend mode "BLEND" → replaces the pixel color on the canvas proportionally to alpha
    blendMode(BLEND);

    // Get the microphone volume level
    vol = mic.getLevel();

    // Define minimum and maximum movement strength
    let minStrength = 0.5;
    let maxStrength = 40;

    // Map the volume to particle movement strength
    let strength = map(vol, 0, 0.3, minStrength, maxStrength);
    // Ensure strength stays within the limits
    strength = constrain(strength, minStrength, maxStrength);

    // Zoom for the noise field, controls motion variation
    let zoom = 300;

    // Hue changes over time (frameCount). To disable and make lines change color as a group, green>yellow>blue,
    // just replace "stroke(p.hue, 80, 80, alpha);" with "stroke(hue, 80, 80, alpha);" and enable the "let hue" below
    // let hue = frameCount * 0.5 % 360;

    // Draw a black background without completely erasing particle trails
    background(0, 40);

    // Loop to update and draw all particles
    for (let i = 0; i < num; i++) {
        let p = particles1[i];

        // Calculate angle based on Perlin noise for smooth motion
        let angle = noise(p.x / zoom, p.y / zoom, frameCount / 600) * TWO_PI;

        // Update previous position
        p.prevX = p.x;
        p.prevY = p.y;

        // Update current position based on angle and strength
        p.x += cos(angle) * strength * 3;
        p.y += sin(angle) * strength * 3;

        // Make particles "teleport" when they go off the screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Decrease particle life
        p.life--;

        if (p.life <= 0) {
            // When it dies, respawn with a new position and life
            p.x = random(width);
            p.y = random(height);
            p.prevX = p.x;
            p.prevY = p.y;
            p.life = 180; // 3 seconds again
        }

        // Set speed based on volume
        let speed = map(vol, 0, 0.3, 1, 5);
        p.x += cos(angle) * speed;
        p.y += sin(angle) * speed;

        // Set alpha (transparency) proportional to remaining life
        let alpha = map(p.life, 0, 180, 0, 0.3);
        // Set particle line color
        stroke(0, 0, 100, alpha); // To use the particle's color, just replace with "stroke(p.hue, 80, 80, alpha)"

        // Draw line from previous point to current point
        line(p.prevX, p.prevY, p.x, p.y);
    }
}
