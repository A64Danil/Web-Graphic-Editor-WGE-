/**
 * Created by Данил on 01.06.2018.
 */
class App {
    constructor(canvas, bgColor) {//  Настройки канваса
        this.canvas = canvas;
        this.frames = 0;
        this.fps = 0;
        this.lastFPSUpdate = 0;
        this.ctx = canvas.getContext('2d'); // устанавливаем контекст для нашего канваса
        this.shapes = [];  // Массив с нашими шейпами (на канвасе)
        this.shapesInArr = [];  // Массив с нашими шейпами во время движения
        this.shapesNumber =  0;
        this.render();
        this.canvas.style.backgroundColor = bgColor;
    }

    addShape(shape) {
        if (shape && !this.shapes.includes(shape)) { // Если шейп есть и его нет в нашем массиве, то добавляем
            this.shapes.push(shape);

            this.shapesNumber = ([].concat(...this.shapes).length);
            console.log('Всего элементов: ' + this.shapesNumber);
        }

    }

    addShapeArray(shape) {
        if (shape && !this.shapesInArr.includes(shape)) { // Если шейп есть и его нет во врем. массиве, то добавляем
            this.shapesInArr.push(shape);
        }
    }

    clearTmpShapeArr() {
        if (this.shapesInArr.length > 0) {
            this.shapes.push(this.shapesInArr.splice(0,this.shapesInArr.length));

            this.shapesNumber = ([].concat(...this.shapes).length);
            console.log('Всего элементов: ' + this.shapesNumber);
            //console.log(this.shapes);
        }
    }

    removeLastShape() {
        this.shapes.pop();
        console.log(this.shapes);
    }

    setCurrentShape(shape) {
        this.currentShape = shape; // устанавливаем текущим шейпом тот, который передали
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // зачищаем канвас
    }

    // Если шейп обладает размером и координатами
    renderShape(shape) {
        if(shape.canRender()) {
            this.ctx.save(); //сохранение состояния
            this.ctx.translate(shape.x, shape.y);
            shape.render(this.ctx); // выбираем канвас и рисуем по методу рендер из соотв. подкласса
            this.ctx.restore();

        }
    }

    render() {
        var self = this;
        requestAnimationFrame(function() {
            self.clear();

            self.shapes.forEach(function(shape) {
                if (shape.length === undefined) {
                    self.renderShape(shape);
                }
                else if (shape.length > 0)
                {
                    shape.forEach(function (shInArr) {
                        self.renderShape(shInArr);
                    });
                }
            });

            self.shapesInArr.forEach(function(shape) {
                self.renderShape(shape);
            });

            if (self.currentShape) {
                self.renderShape(self.currentShape);
            }

            self.render(); // cycling

            self.frames++;

            const now = performance.now();

            if (now - self.lastFPSUpdate >= 1000) { // frames здесь - количество кадров между сейчас и последним апдейтом
                self.lastFPSUpdate = now;

                self.fps = self.frames;
                self.frames = 0; // обнуляем счеьчик кадров
            }

            self.renderFPS();
            self.renderShapesNumber();
        });
    }

    renderFPS() {
        this.ctx.save();
        this.ctx.font = "14px Arial";
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 30);
        this.ctx.restore();
    }

    renderShapesNumber() {
        this.ctx.save();
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`Shapes: ${this.shapesNumber}`, 10, 60);
        this.ctx.restore();
    }
}