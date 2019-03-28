let ctx;
onload = () => {
  const size = 20
  const angle = 0.7
  const canvas = document.querySelector("#canvas")
  const textarea = document.querySelector("#input")
  ctx = canvas.getContext('2d');
  textarea.onchange = () => {
    draw()
  }



map = [{x:0,y:0,z:0, block: "minecraft:iron_ore"}]
actualMap = []
  function draw() {
    drawCube(0,0,0, "#0066cc");
    drawCube(1,0,0, "#0066cc");
    drawCube(2,0,0, "#0066cc");
    drawCube(3,0,0, "#0066cc");
    drawCube(2,1,0, "#0066cc");
    drawCube(2,-1,0, "#0066cc");
    drawCube(2,2,0,"#0066cc");
  }

//Object position which is a 3D point (X, Y, Z),
//Camera position which is a 3D point (X, Y, Z),
//Camera yaw, pitch, roll (-180:180, -90:90, 0)
//Field of view (-45°:45°)
//Screen width & height
  function Camera() {
    this.yaw = 0 //-180:180
    this.pitch = 0 //-90:90
    this.roll = 0
    this.pos = {x:0, y: 20, z: -50}
  }

  function drawCube(sx, sy, sz, color) {
    pitch = Math.atan(coord.x - cam.x / coord.y - cam.y)
    yaw = Math.atan(coord.z - cam.z / coord.y - cam.y)
    y = (sy * size) + canvas.height / 2 + (size/2*sx - size)
    x = (sx * size) + canvas.width / 2 + (size/2*sy - size)
    const wx = size
    const wy = size
    const h = size
    actualMap.push({x: x, y: y})
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - wx, y - wx * 0.5);
    ctx.lineTo(x - wx, y - h - wx * 0.5);
    ctx.lineTo(x, y - h * 1);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + wy, y - wy * 0.5);
    ctx.lineTo(x + wy, y - h - wy * 0.5);
    ctx.lineTo(x, y - h * 1);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x - wx, y - h - wx * 0.5);
    ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
    ctx.lineTo(x + wy, y - h - wy * 0.5);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fill();
  }
  draw()
}
