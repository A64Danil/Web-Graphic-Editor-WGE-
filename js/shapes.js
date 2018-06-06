/**
 * Created by Данил on 01.06.2018.
 */
class Primitive {
    constructor(size, x, y, x2, y2) {
        this.setPosition(x, y);
        this.setSize(size);
        if (x2 && y2) {
            console.log('конечные координаты существуют');
            this.setEndPosition(x2, y2);
        }
    }

    setEndPosition(x, y) {
        this.x2 = x;
        this.y2 = y;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(size) {
        this.size = size < 0 ? 0 : size;
    }

    setFillColor(color) {
        this.fillColor = color; // запомнили цвет фигуры
    }

    canRender() {
        return (
            Number.isFinite(this.size) &&
            Number.isFinite(this.x) &&
            Number.isFinite(this.y)
        );
    }

    render(ctx) {
        throw new Error('this is an abstract shape');
    }
}


class Shape extends Primitive {
    setIsStroke(state, color, width) {
        if (state == false) {
            this.strokeColor = color;
            this.strokeWidth = 1;
            console.log('у этой фигуры рамка отключена');
        }
        else {
            this.strokeColor = color;
            this.strokeWidth = width;
            console.log('у этой фигуры рамка ВКключена');
        }
    }

    setStrokeColor(color) {
        this.strokeColor = color;
    }

    setStrokeWidth(width) {
        this.strokeWidth = width;
    }
}

class Circle extends Shape {
    render(ctx) {
        ctx.beginPath();

        ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI, false);

        ctx.fillStyle = this.fillColor; // отдаём запомненный цвет на отрисовку в канвас
        ctx.fill(); // заливаем

        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
}

class Quad extends Shape {
    render(ctx) {
        ctx.beginPath();

        ctx.rect(
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
}

class Triangle extends Shape {
    render(ctx) {
        ctx.beginPath();

        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();

        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
}



class EreaserCircle extends Circle {
    setStrokeWidth() {
        this.strokeWidth = 1;
    }

    setStrokeColor() {
        this.strokeColor = canvasBgrColor;
    }
    setFillColor() {
        this.fillColor = canvasBgrColor;
    }
}

class EreaserQuad extends Quad {
    setStrokeWidth() {
        this.strokeWidth = 1;
    }
    setStrokeColor() {
        this.strokeColor = canvasBgrColor;
    }
    setFillColor() {
        this.fillColor = canvasBgrColor;
    }
}

class EreaserTriangle extends Triangle {
    setStrokeWidth() {
        this.strokeWidth = 1;
    }
    setStrokeColor() {
        this.strokeColor = canvasBgrColor;
    }
    setFillColor() {
        this.fillColor = canvasBgrColor;
    }
}



class Brush extends Primitive {
    setStrokeColor() {
        this.strokeColor = currentFillColor;
    }

    setStrokeWidth() {
        this.strokeWidth = 1;
    }
}

class CircleBrush extends Brush {
    render(ctx) {
        ctx.beginPath();

        ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI, false);

        ctx.fillStyle = this.fillColor; // отдаём запомненный цвет на отрисовку в канвас
        ctx.fill(); // заливаем

        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
}

class QuadBrush extends Brush {
    render(ctx) {
        ctx.beginPath();

        ctx.rect(
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
}


class Line extends Primitive {
    setStrokeColor() {
        this.strokeColor = currentFillColor;
    }

    setStrokeWidth() {
        this.strokeWidth = 10;
    }

    // TODO: сделать рисование линий по двум кликам
    render(ctx) {
        // Создаем новый путь (с текущим цветом и толщиной линии)
        ctx.beginPath();
        // Нажатием левой кнопки мыши помещаем "кисть" на холст
        ctx.moveTo(0, 0);
        // Рисуем линию до новой координаты
        ctx.lineTo(this.strokeWidth, this.strokeWidth);
        ctx.closePath();

        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
}