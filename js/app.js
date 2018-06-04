/**
 * Created by ����� on 01.06.2018.
 */
class App {
    constructor(canvas) {//  ��������� �������
        this.canvas = canvas;
        this.frames = 0;
        this.fps = 0;
        this.lastFPSUpdate = 0;
        this.ctx = canvas.getContext('2d'); // ������������� �������� ��� ������ �������
        this.shapes = [];  // ������ � ������ ������� (�� �������)
        this.render(); // ???
    }

    addShape(shape) {
        if (shape && !this.shapes.includes(shape)) { // ���� ���� ���� � ��� ��� � ������ ������, �� ���������
            this.shapes.push(shape);
        }
        console.log(this.shapes);
    }

    removeLastShape() {
        this.shapes.pop();
        console.log(this.shapes);
    }

    setCurrentShape(shape) {
        this.currentShape = shape; // ������������� ������� ������ ���, ������� ��������
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // �������� ������
    }

    // ���� ���� �������� �������� � ������������
    renderShape(shape) {
        if(shape.canRender()) {
            this.ctx.save(); //���������� ���������
            this.ctx.translate(shape.x, shape.y);
            shape.render(this.ctx); // �������� ������ � ������ �� ������ ������ �� �����. ���������
            this.ctx.restore();

        }
    }

    render() {
        var self = this;
        requestAnimationFrame(function() {
            self.clear();

            self.shapes.forEach(function(shape) {
                self.renderShape(shape);
            });

            if (self.currentShape) {
                self.renderShape(self.currentShape);
            }

            self.render(); // cycling

            self.frames++;

            const now = performance.now();

            if (now - self.lastFPSUpdate >= 1000) { // frames ����� - ���������� ������ ����� ������ � ��������� ��������
                self.lastFPSUpdate = now;

                self.fps = self.frames;
                self.frames = 0; // �������� ������� ������
            }

            self.renderFPS();
        });
    }

    renderFPS() {
        this.ctx.save();
        this.ctx.font = "18px Arial";
        this.ctx.fillText(`${this.fps}`, 10, 30);
        this.ctx.restore();
    }
}