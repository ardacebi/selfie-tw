// Star background animation for dark theme
// This file contains all the logic for rendering the animated star background

// Initialize star background animation on provided canvas elements
export const initStarAnimation = (backgroundCanvas, starsCanvas, milkyWayCanvas, animationRef) => {
  if (!backgroundCanvas || !starsCanvas || !milkyWayCanvas) {
    console.error("Canvas elements not found");
    return () => {}; // Return empty cleanup function
  }
  
  const dpr = window.devicePixelRatio || 1;
  
  // Set up stars canvas
  starsCanvas.width = window.innerWidth * dpr;
  starsCanvas.height = window.innerHeight * dpr;
  const ctx = starsCanvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  // Set up milky way canvas
  milkyWayCanvas.width = window.innerWidth * dpr;
  milkyWayCanvas.height = window.innerHeight * dpr;
  const ctxMw = milkyWayCanvas.getContext('2d');
  ctxMw.scale(dpr, dpr);
  
  // Constants for star appearance
  const sNumber = 600;
  const sSize = 0.3;
  const sSizeR = 0.6;
  const sAlphaR = 0.5;
  
  // Shooting stars parameters
  const shootingStarDensity = 0.01;
  const shootingStarBaseXspeed = 30;
  const shootingStarBaseYspeed = 15;
  const shootingStarBaseLength = 8;
  const shootingStarBaseLifespan = 60;
  const shootingStarsColors = [
    "#a1ffba", // greenish
    "#a1d2ff", // blueish
    "#fffaa1", // yellowish
    "#ffa1a1"  // redish
  ];
  
  // Milky way constants
  const mwStarCount = 100000;
  const mwRandomStarProp = 0.2;
  const mwClusterCount = 300;
  const mwClusterStarCount = 1500;
  const mwClusterSize = 120;
  const mwClusterSizeR = 80;
  const mwClusterLayers = 10;
  const mwAngle = 0.6;
  const mwHueMin = 150;
  const mwHueMax = 300;
  const mwWhiteProportionMin = 50;
  const mwWhiteProportionMax = 65;
  
  // Random values arrays
  const randomArrayLength = 1000;
  const hueArrayLength = 1000;
  let randomArray = Array.from({ length: randomArrayLength }, () => Math.random());
  let randomArrayIterator = 0;
  
  // Generate hue array for stars
  let hueArray = Array.from({ length: hueArrayLength }, () => {
    let rHue = Math.floor(Math.random() * 160);
    if (rHue > 60) rHue += 110; // Avoid greenish looking stars
    return rHue;
  });
  
  // Star arrays
  let StarsArray = [];
  let ShootingStarsArray = [];
  
  // Star class
  class Star {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.alpha = size / (sSize + sSizeR);
      this.baseHue = hueArray[Math.floor(Math.random() * hueArrayLength)];
      this.baseHueProportion = Math.random();
      this.randomIndexa = Math.floor(Math.random() * randomArrayLength);
      this.randomIndexh = this.randomIndexa;
      this.randomValue = randomArray[this.randomIndexa];
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      let rAlpha = this.alpha + Math.min((this.randomValue - 0.5) * sAlphaR, 1);
      let rHue = randomArray[this.randomIndexh] > this.baseHueProportion 
        ? hueArray[this.randomIndexa] 
        : this.baseHue;
      this.color = "hsla(" + rHue + ",100%,85%," + rAlpha + ")";
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    update() {
      this.randomIndexh = this.randomIndexa;
      this.randomIndexa = (this.randomIndexa >= 999) ? 0 : this.randomIndexa + 1;
      this.randomValue = randomArray[this.randomIndexa];
      this.draw();
    }
  }
  
  // ShootingStar class
  class ShootingStar {
    constructor(x, y, speedX, speedY, color) {
      this.x = x;
      this.y = y;
      this.speedX = speedX;
      this.speedY = speedY;
      this.framesLeft = shootingStarBaseLifespan;
      this.color = color;
    }
    
    goingOut() {
      return this.framesLeft <= 0;
    }
    
    ageModifier() {
      let halfLife = shootingStarBaseLifespan / 2.0;
      return Math.pow(1.0 - Math.abs(this.framesLeft - halfLife) / halfLife, 2);
    }
    
    draw() {
      let am = this.ageModifier();
      let endX = this.x - this.speedX * shootingStarBaseLength * am;
      let endY = this.y - this.speedY * shootingStarBaseLength * am;
      let gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
      gradient.addColorStop(0, "#fff");
      gradient.addColorStop(Math.min(am, 0.7), this.color);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    update() {
      this.framesLeft--;
      this.x += this.speedX;
      this.y += this.speedY;
      this.draw();
    }
  }
  
  // MwStarCluster class
  class MwStarCluster {
    constructor(x, y, size, hue, baseWhiteProportion, brightnessModifier) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.hue = hue;
      this.baseWhiteProportion = baseWhiteProportion;
      this.brightnessModifier = brightnessModifier;
    }
    
    draw() {
      let starsPerLayer = Math.floor(mwClusterStarCount / mwClusterLayers);
      for (let layer = 1; layer < mwClusterLayers; layer++) {
        let layerRadius = this.size * layer / mwClusterLayers;
        for (let i = 1; i < starsPerLayer; i++) {
          let posX = this.x + 2 * layerRadius * (Math.random() - 0.5);
          let posY = this.y + 2 * Math.sqrt(Math.pow(layerRadius, 2) - Math.pow(this.x - posX, 2)) * (Math.random() - 0.5);
          let size = 0.05 + Math.random() * 0.15;
          let alpha = 0.3 + Math.random() * 0.4;
          let whitePercentage = this.baseWhiteProportion + 15 + 15 * this.brightnessModifier + Math.floor(Math.random() * 10);
          ctxMw.beginPath();
          ctxMw.arc(posX, posY, size, 0, Math.PI * 2, false);
          ctxMw.fillStyle = "hsla(" + this.hue + ",100%," + whitePercentage + "%," + alpha + ")";
          ctxMw.fill();
        }
      }
      
      let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0, "hsla(" + this.hue + ",100%," + this.baseWhiteProportion + "%,0.002)");
      gradient.addColorStop(0.25, "hsla(" + this.hue + ",100%," + (this.baseWhiteProportion + 30) + "%," + (0.01 + 0.01 * this.brightnessModifier) + ")");
      gradient.addColorStop(0.4, "hsla(" + this.hue + ",100%," + (this.baseWhiteProportion + 15) + "%,0.005)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctxMw.beginPath();
      ctxMw.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctxMw.fillStyle = gradient;
      ctxMw.fill();
    }
  }
  
  // Helper functions
  function MilkyWayX() {
    return Math.floor(Math.random() * window.innerWidth);
  }
  
  function MilkyWayYFromX(xPos, mode) {
    let offset = ((window.innerWidth / 2) - xPos) * mwAngle;
    if (mode === "star") {
      return Math.floor(Math.pow(Math.random(), 1.2) * window.innerHeight * (Math.random() - 0.5) 
        + window.innerHeight / 2 + (Math.random() - 0.5) * 100) + offset;
    } else {
      return Math.floor(Math.pow(Math.random(), 1.5) * window.innerHeight * 0.6 * (Math.random() - 0.5) 
        + window.innerHeight / 2 + (Math.random() - 0.5) * 100) + offset;
    }
  }
  
  // Create stars based on current window dimensions
  function createStars() {
    StarsArray = [];
    for (let i = 0; i < sNumber; i++) {
      let size = (Math.random() * sSizeR) + sSize;
      let x = Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2;
      let y = Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2;
      StarsArray.push(new Star(x, y, size));
    }
  }
  
  // Draw milky way
  function DrawMilkyWayCanvas() {
    ctxMw.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw unclustered stars
    for (let i = 0; i < mwStarCount; i++) {
      ctxMw.beginPath();
      let xPos = MilkyWayX();
      let yPos = Math.random() < mwRandomStarProp 
        ? Math.floor(Math.random() * window.innerHeight) 
        : MilkyWayYFromX(xPos, "star");
      let size = Math.random() * 0.27;
      ctxMw.arc(xPos, yPos, size, 0, Math.PI * 2, false);
      let alpha = 0.4 + Math.random() * 0.6;
      ctxMw.fillStyle = "hsla(0,100%,100%," + alpha + ")";
      ctxMw.fill();
    }
    
    // Draw clusters
    for (let i = 0; i < mwClusterCount; i++) {
      let xPos = MilkyWayX();
      let yPos = MilkyWayYFromX(xPos, "cluster");
      let distToCenter = (1 - (Math.abs(xPos - window.innerWidth / 2) / (window.innerWidth / 2)))
        * (1 - (Math.abs(yPos - window.innerHeight / 2) / (window.innerHeight / 2)));
      let size = mwClusterSize + Math.random() * mwClusterSizeR;
      let hue = mwHueMin + Math.floor((Math.random() * 0.5 + distToCenter * 0.5) * (mwHueMax - mwHueMin));
      let baseWhiteProportion = mwWhiteProportionMin + Math.random() * (mwWhiteProportionMax - mwWhiteProportionMin);
      new MwStarCluster(xPos, yPos, size, hue, baseWhiteProportion, distToCenter).draw();
    }
  }
  
  // Handle window resize
  function handleResize() {
    const dpr = window.devicePixelRatio || 1;
    
    starsCanvas.width = window.innerWidth * dpr;
    starsCanvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    
    milkyWayCanvas.width = window.innerWidth * dpr;
    milkyWayCanvas.height = window.innerHeight * dpr;
    ctxMw.scale(dpr, dpr);
    
    createStars();
    DrawMilkyWayCanvas();
  }
  
  // Save the resize handler for cleanup
  window.starAnimationResizeHandler = handleResize;
  window.addEventListener('resize', handleResize);
  
  // Initialize everything
  createStars();
  DrawMilkyWayCanvas();
  
  // Animation loop
  function animate() {
    animationRef.current = requestAnimationFrame(animate);
    
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Update all stars
    for (let i = 0; i < StarsArray.length; i++) {
      StarsArray[i].update();
    }
    
    // Add shooting stars randomly
    if (randomArray[randomArrayIterator] < shootingStarDensity) {
      let posX = Math.floor(Math.random() * starsCanvas.width);
      let posY = Math.floor(Math.random() * 150);
      let speedX = Math.floor((Math.random() - 0.5) * shootingStarBaseXspeed);
      let speedY = Math.floor(Math.random() * shootingStarBaseYspeed);
      let color = shootingStarsColors[Math.floor(Math.random() * shootingStarsColors.length)];
      ShootingStarsArray.push(new ShootingStar(posX, posY, speedX, speedY, color));
    }
    
    // Update and remove shooting stars
    let arrayIterator = ShootingStarsArray.length - 1;
    while (arrayIterator >= 0) {
      if (ShootingStarsArray[arrayIterator].goingOut()) {
        ShootingStarsArray.splice(arrayIterator, 1);
      } else {
        ShootingStarsArray[arrayIterator].update();
      }
      arrayIterator--;
    }
    
    // Update random array iterator
    randomArrayIterator = (randomArrayIterator + 1) % randomArrayLength;
  }
  
  // Start animation
  animate();
  
  // Return cleanup function
  return () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (window.starAnimationResizeHandler) {
      window.removeEventListener('resize', window.starAnimationResizeHandler);
      window.starAnimationResizeHandler = null;
    }
  };
};

// CSS styles for star background canvases
export const starBackgroundStyles = {
  canvasContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none'
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  backgroundCanvas: {
    background: 'radial-gradient(#0a0414,#000000)',
  }
};