/**
 * Created by Данил on 01.06.2018.
 */
class Shape {
    constructor(x, y, size) {
        this.setPosition(x, y);
        this.setSize(size);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(size) {
        this.size = size < 0 ? 0 : size;
    }

    setStrokeColor(color) {
        this.strokeColor = color;
    }

    setFillColor(color) {
        this.fillColor = color; // запомнили цвет фигуры
    }

    setStrokeWidth(width) {
        this.strokeWidth = width;
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

class Ereaser extends Shape {
    render(ctx) {
        ctx.clearRect(-this.size / 2, -this.size / 2, this.size, this.size); // зачищаем канвас
    }
}