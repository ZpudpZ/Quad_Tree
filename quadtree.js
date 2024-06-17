class Punto {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangulo {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contiene(punto) {
        return (punto.x >= this.x - this.w &&
                punto.x <= this.x + this.w &&
                punto.y >= this.y - this.h &&
                punto.y <= this.y + this.h);
    }

    intersecta(rango) {
        return !(rango.x - rango.w > this.x + this.w ||
                 rango.x + rango.w < this.x - this.w ||
                 rango.y - rango.h > this.y + this.h ||
                 rango.y + rango.h < this.y - this.h);
    }
}

class QuadTree {
    constructor(limite, capacidad) {
        this.limite = limite;
        this.capacidad = capacidad;
        this.puntos = [];
        this.dividido = false;
    }

    subdividir() {
        let x = this.limite.x;
        let y = this.limite.y;
        let w = this.limite.w;
        let h = this.limite.h;

        let ne = new Rectangulo(x + w / 2, y - h / 2, w / 2, h / 2);
        this.noreste = new QuadTree(ne, this.capacidad);
        let no = new Rectangulo(x - w / 2, y - h / 2, w / 2, h / 2);
        this.noroeste = new QuadTree(no, this.capacidad);
        let se = new Rectangulo(x + w / 2, y + h / 2, w / 2, h / 2);
        this.sureste = new QuadTree(se, this.capacidad);
        let so = new Rectangulo(x - w / 2, y + h / 2, w / 2, h / 2);
        this.suroeste = new QuadTree(so, this.capacidad);

        this.dividido = true;
    }

    insertar(punto) {
        if (!this.limite.contiene(punto)) {
            return false;
        }

        if (this.puntos.length < this.capacidad) {
            this.puntos.push(punto);
            return true;
        } else {
            if (!this.dividido) {
                this.subdividir();
            }

            if (this.noreste.insertar(punto)) {
                return true;
            } else if (this.noroeste.insertar(punto)) {
                return true;
            } else if (this.sureste.insertar(punto)) {
                return true;
            } else if (this.suroeste.insertar(punto)) {
                return true;
            }
        }
    }

    consultar(rango, encontrados) {
        if (!encontrados) {
            encontrados = [];
        }

        if (!this.limite.intersecta(rango)) {
            return encontrados;
        } else {
            for (let p of this.puntos) {
                if (rango.contiene(p)) {
                    encontrados.push(p);
                }
            }
            if (this.dividido) {
                this.noroeste.consultar(rango, encontrados);
                this.noreste.consultar(rango, encontrados);
                this.suroeste.consultar(rango, encontrados);
                this.sureste.consultar(rango, encontrados);
            }
        }

        return encontrados;
    }

    mostrar() {
        stroke(255);
        noFill();
        rectMode(CENTER);
        rect(this.limite.x, this.limite.y, this.limite.w * 2, this.limite.h * 2);
        if (this.dividido) {
            this.noroeste.mostrar();
            this.noreste.mostrar();
            this.suroeste.mostrar();
            this.sureste.mostrar();
        }
        for (let p of this.puntos) {
            strokeWeight(4);
            point(p.x, p.y);
        }
    }
}
