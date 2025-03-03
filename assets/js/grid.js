const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Grid resolution
const numSteps = 100;       // Number of lines in each direction
const spacing = 0.1;        // Distance between grid lines in "world" coordinates

// Wave parameters
const amplitude = 0.3;      // Amplitude for the origin ripple
const waveLength = 1;       // Wavelength parameter
let time = 0;
const speed = 0.03;         // Speed of the ripple

// Rotation angles (in radians) for a gentler tilt
const angleX = -Math.PI / 6;  
const angleY = 0;
const angleZ = 0;

// Scale for drawing (since amplitude is small, we can increase scale a bit)
const scale3D = 50;  

// Mouse ripple parameters
let mouseActive = false;
let mouseWorld = { x: 0, y: 0 };
const mouseAmplitudeFactor = 0.5;  // Mouse ripple amplitude as a factor of "amplitude"

// -- 3D transform helpers (rotate around X, Y, Z) --
function rotateX(x, y, z, angle) {
const cos = Math.cos(angle);
const sin = Math.sin(angle);
const y2 = y * cos - z * sin;
const z2 = y * sin + z * cos;
return [x, y2, z2];
}

function rotateY(x, y, z, angle) {
const cos = Math.cos(angle);
const sin = Math.sin(angle);
const x2 = x * cos + z * sin;
const z2 = -x * sin + z * cos;
return [x2, y, z2];
}

function rotateZ(x, y, z, angle) {
const cos = Math.cos(angle);
const sin = Math.sin(angle);
const x2 = x * cos - y * sin;
const y2 = x * sin + y * cos;
return [x2, y2, z];
}

// -- Simple orthographic projection to 2D --
function project(x, y, z) {
// Scale and shift to center of canvas
const px = x * scale3D + width / 2;
const py = y * scale3D + height / 2;
return [px, py];
}

// Calculate 3D point for grid coordinate (i, j) at time t
function get3DPoint(i, j, t) {
const half = numSteps / 2;
// Center the grid around 0,0
const x = (i - half) * spacing;
const y = (j - half) * spacing;

// Distance from origin (0,0)
const rOrigin = Math.sqrt(x * x + y * y);
const zOrigin = amplitude * Math.sin((rOrigin * Math.PI / waveLength) - t);

// Add an extra ripple from the mouse (if active)
let zMouse = 0;
if (mouseActive) {
    // Calculate distance from this grid point to the mouse in world coordinates
    const dx = x - mouseWorld.x;
    const dy = y - mouseWorld.y;
    const rMouse = Math.sqrt(dx * dx + dy * dy);
    zMouse = amplitude * mouseAmplitudeFactor * Math.sin((rMouse * Math.PI / waveLength) - t);
}

const z = zOrigin + zMouse;

// Apply rotation for the angled perspective
let [rx, ry, rz] = rotateX(x, y, z, angleX);
[rx, ry, rz] = rotateY(rx, ry, rz, angleY);
[rx, ry, rz] = rotateZ(rx, ry, rz, angleZ);

return { x: rx, y: ry, z: rz };
}

// Draw the entire grid with dark mode styling
function drawGrid(t) {
// Fill with dark background
ctx.fillStyle = "#222";  // Dark gray background
ctx.fillRect(0, 0, width, height);

ctx.strokeStyle = "#fff"; // White grid lines

// Horizontal lines (fixed j, varying i)
for (let j = 0; j <= numSteps; j++) {
    ctx.beginPath();
    for (let i = 0; i <= numSteps; i++) {
    const { x, y, z } = get3DPoint(i, j, t);
    const [px, py] = project(x, y, z);
    if (i === 0) {
        ctx.moveTo(px, py);
    } else {
        ctx.lineTo(px, py);
    }
    }
    ctx.stroke();
}

// Vertical lines (fixed i, varying j)
for (let i = 0; i <= numSteps; i++) {
    ctx.beginPath();
    for (let j = 0; j <= numSteps; j++) {
    const { x, y, z } = get3DPoint(i, j, t);
    const [px, py] = project(x, y, z);
    if (j === 0) {
        ctx.moveTo(px, py);
    } else {
        ctx.lineTo(px, py);
    }
    }
    ctx.stroke();
}
}

// Animation loop
function animate() {
time += speed;
drawGrid(time);
requestAnimationFrame(animate);
}

animate();

// -- Mouse event handlers for interactive rippling --
canvas.addEventListener('mousemove', (e) => {
const rect = canvas.getBoundingClientRect();
const mx = e.clientX - rect.left;
const my = e.clientY - rect.top;
// Convert canvas mouse coordinates to grid "world" coordinates (pre-projection)
mouseWorld.x = (mx - width / 2) / scale3D;
mouseWorld.y = (my - height / 2) / scale3D;
mouseActive = true;
});

canvas.addEventListener('mouseleave', () => {
mouseActive = false;
});
