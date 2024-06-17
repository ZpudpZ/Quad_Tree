let qt;

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('canvas-container');
    let limite = new Rectangulo(200, 200, 200, 200);
    qt = new QuadTree(limite, 4);
}

function draw() {
    background(0);
    qt.mostrar();
}

function mousePressed() {
    let p = new Punto(mouseX, mouseY);
    qt.insertar(p);
}
