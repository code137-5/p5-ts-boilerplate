import "p5";
import p5 from "p5";

let ps;
let img;

function preload() {
  img = loadImage("texture.png");
}

function setup() {
  createCanvas(640, 360);
  ps = new ParticleSystem(0, createVector(width / 2, height - 75), img);
}

function draw() {
  // Try additive blending!
  // You also need clear or else the colors will accumulate between frames
  blendMode(ADD);
  clear();

  background(0);

  // Additive blending!
  // Calculate a "wind" force based on mouse horizontal position
  let dx = map(mouseX, 0, width, -0.2, 0.2);
  let wind = createVector(dx, 0);
  ps.applyForce(wind);
  ps.run();
  for (let i = 0; i < 2; i++) {
    ps.addParticle();
  }

  // Draw an arrow representing the wind force
  drawVector(wind, createVector(width / 2, 50, 0), 500);
}

// Renders a vector object 'v' as an arrow and a position 'loc'
function drawVector(v, pos, scayl) {
  push();
  let arrowsize = 4;
  // Translate to position to render vector
  translate(pos.x, pos.y);
  stroke(255);
  // Call vector heading function to get direction (note that pointing up is a heading of 0) and rotate
  rotate(v.heading());
  // Calculate length of vector & scale it to be bigger or smaller if necessary
  let len = v.mag() * scayl;
  // Draw three lines to make an arrow (draw pointing up since we've rotate to the proper direction)
  line(0, 0, len, 0);
  line(len, 0, len - arrowsize, +arrowsize / 2);
  line(len, 0, len - arrowsize, -arrowsize / 2);
  pop();
}

// function mousePressed() {
//   pendulum.clicked(mouseX, mouseY);
// }

// function mouseReleased() {
//   pendulum.stopDragging();
// }

// p5.js requires `setup` and `draw` to be methods of global object
window.preload = preload;
window.setup = setup;
window.draw = draw;
// window.mouseMoved = mouseMoved;
// window.mousePressed = mousePressed;
// window.mouseDragged = mouseDragged;
// window.mouseReleased = mouseReleased;

function randomColor() {
  return color(random(255), random(255), random(255), 127);
}

class ParticleSystem {
  particles: Particle[];
  origin: p5.Vector;
  img: p5.Image;

  constructor(num, v, img) {
    this.particles = []; // Initialize the arraylist
    this.origin = v.copy(); // Store the origin point
    this.img = img;
    for (let i = 0; i < num; i++) {
      this.particles.push(new Particle(this.origin, this.img)); // Add "num" amount of particles to the arraylist
    }
  }

  run() {
    for (let particle of this.particles) {
      particle.run();
    }
    this.particles = this.particles.filter((particle) => !particle.isDead());
  }

  // Method to add a force vector to all particles currently in the system
  applyForce(dir) {
    // Enhanced loop!!!
    for (let particle of this.particles) {
      particle.applyForce(dir);
    }
  }

  addParticle() {
    this.particles.push(new Particle(this.origin, this.img));
  }
}

class Particle {
  acc: p5.Vector;
  vel: p5.Vector;
  pos: p5.Vector;
  lifespan: number;
  img: p5.Image;

  constructor(pos, img) {
    this.acc = createVector(0, 0);
    let vx = randomGaussian(0, 1) * 0.3;
    let vy = randomGaussian(0, 1) * 0.3 - 1.0;
    this.vel = createVector(vx, vy);
    this.pos = pos.copy();
    this.lifespan = 100.0;
    this.img = img;
  }

  run() {
    this.update();
    this.render();
  }

  // Method to apply a force vector to the Particle object
  // Note we are ignoring "mass" here
  applyForce(f) {
    this.acc.add(f);
  }

  // Method to update position
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 2.5;
    this.acc.mult(0); // clear Acceleration
  }

  // Method to display
  render() {
    imageMode(CENTER);
    tint(255, this.lifespan);
    image(img, this.pos.x, this.pos.y);
    // Drawing a circle instead
    // fill(255,lifespan);
    // noStroke();
    // ellipse(pos.x,pos.y,img.width,img.height);
  }

  // Is the particle still useful?
  isDead() {
    if (this.lifespan <= 0.0) {
      return true;
    } else {
      return false;
    }
  }
}
