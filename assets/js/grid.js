const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

const numSteps = 120; // Number of grid divisions
const spacing = 0.1; // World units between grid points
const amplitude = 0.2; // Base ripple amplitude
const waveLength = 1; // Wavelength of ripple
let time = 0;
const speed = 0.03; // Ripple speed

// Rotation angles for perspective
const angleX = -Math.PI / 2.2;
const angleY = 0;
const angleZ = 0;

let scale3D = 30; // Updated based on canvas width

// Mouse ripple parameters
let mouseActive = false;
let mouseWorld = {
    x: 0,
    y: 0
};
const mouseAmplitudeFactor = 0.5; // Try keeping this high if possible

// Resize canvas to match the #interactive-grid element and update scale3D.
function resizeCanvas() {
    const interactiveGrid = document.getElementById('interactive-grid');
    canvas.width = interactiveGrid.clientWidth;
    canvas.height = interactiveGrid.clientHeight;
    // Scale so that the grid's total world width (numSteps*spacing) fills the canvas width.
    scale3D = canvas.width / (numSteps * spacing);
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Rotation helper functions.
function rotateX(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x, y * cos - z * sin, y * sin + z * cos];
}

function rotateY(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateZ(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x * cos - y * sin, x * sin + y * cos, z];
}

// Project a 3D point to 2D using current canvas dimensions.
function project(x, y, z) {
    const px = x * scale3D + canvas.width / 2;
    const py = y * scale3D + canvas.height / 2;
    return [px, py];
}

// Compute a 3D point for grid coordinate (i, j) at time t,
// with mouse ripple effect added (and clamped to ±0.1 world units).
function get3DPoint(i, j, t) {
    const half = numSteps / 2;
    const x = (i - half) * spacing;
    const y = (j - half) * spacing;
    const rOrigin = Math.sqrt(x * x + y * y);
    const zOrigin = amplitude * Math.sin((rOrigin * Math.PI / waveLength) - t);

    let zMouse = 0;
    if (mouseActive) {
        const dx = x - mouseWorld.x;
        const dy = y - mouseWorld.y;
        const rMouse = Math.sqrt(dx * dx + dy * dy);
        let extra = amplitude * mouseAmplitudeFactor * Math.sin((rMouse * Math.PI / waveLength) - t);
        const maxExtra = 0.1; // Clamp extra ripple to ±0.1 world units.
        extra = Math.max(-maxExtra, Math.min(extra, maxExtra));
        zMouse = extra;
    }

    const z = zOrigin + zMouse;

    let [rx, ry, rz] = rotateX(x, y, z, angleX);
    [rx, ry, rz] = rotateY(rx, ry, rz, angleY);
    [rx, ry, rz] = rotateZ(rx, ry, rz, angleZ);
    return {
        x: rx,
        y: ry,
        z: rz
    };
}

// Draw the grid; shift it downward if any point goes above y = 0.
function drawGrid(t) {
    // Clear the canvas.
    ctx.fillStyle = "#212121";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Compute the minimum projected y value across all grid points.
    let minY = Infinity;
    for (let i = 0; i <= numSteps; i++) {
        for (let j = 0; j <= numSteps; j++) {
            const pt = get3DPoint(i, j, t);
            const [, py] = project(pt.x, pt.y, pt.z);
            if (py < minY) {
                minY = py;
            }
        }
    }

    // If minY is negative, shift the grid down by -minY so the top edge is at y = 0.
    let offset = (minY < 0) ? -minY : 0;

    ctx.save();
    ctx.translate(0, offset);

    ctx.lineWidth = 0.2;
    ctx.strokeStyle = "#fff";

    // Draw horizontal grid lines.
    for (let j = 0; j <= numSteps; j++) {
        ctx.beginPath();
        for (let i = 0; i <= numSteps; i++) {
            const {
                x,
                y,
                z
            } = get3DPoint(i, j, t);
            const [px, py] = project(x, y, z);
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
    }

    // Draw vertical grid lines.
    for (let i = 0; i <= numSteps; i++) {
        ctx.beginPath();
        for (let j = 0; j <= numSteps; j++) {
            const {
                x,
                y,
                z
            } = get3DPoint(i, j, t);
            const [px, py] = project(x, y, z);
            if (j === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
    }

    ctx.restore();
}

function animate() {
    time += speed;
    drawGrid(time);
    requestAnimationFrame(animate);
}
animate();

// Mouse event handlers.
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseWorld.x = (mx - canvas.width / 2) / scale3D;
    mouseWorld.y = (my - canvas.height / 2) / scale3D;
    mouseActive = true;
});
canvas.addEventListener('mouseleave', () => {
    mouseActive = false;
});