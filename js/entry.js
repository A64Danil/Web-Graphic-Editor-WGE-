/**
 * Created by Данил on 04.06.2018.
 */
const canvas = document.getElementById('myCanvas'); // Выбираем канвас.
const app = new App(canvas); // Запускаем приложение применительно к выбранному канвасу
const classMap = {
    quad: Quad,
    circle: Circle,
    triangle: Triangle,
    ereaser: Ereaser
};

let currentFillColor = "#C6BAEE";
let currentStrokeColor = "#9D8CD7";
let currentStrokeWidth = 2;
let currentSize = 100;


canvas.addEventListener("mousemove", function (e) {
    if (app.currentShape) {
        app.currentShape.setPosition(e.clientX, e.clientY)
    }
});

canvas.addEventListener("click", function (e) {
    if (app.currentShape) {
        const shapeClass = app.currentShape.constructor; // записываем класс шейпа в константу
        const shape = createShape(shapeClass, e.clientX, e.clientY);

        app.addShape(app.currentShape); // добавляем в массив фигур нашего канваса текущий шейп;
        app.setCurrentShape(shape); // Говорим что новый шейп в руках - тот что нарисовали
    }
    console.log(app.currentShape.constructor); //TODO: изучить другие свойства объекта
});

canvas.addEventListener("wheel", function (e) {
    e.preventDefault();

    if (app.currentShape) {
        currentSize = app.currentShape.size + e.deltaY;
        app.currentShape.setSize(currentSize);
    }
});

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 27) {
        app.currentShape = null;
        app.setCurrentShape(null);
        console.log('Вы нажали на esc, keyCode - ' + e.keyCode)
    }
});

// получаем форму шэпа из дата-* после клика
document.addEventListener("click", function (e) {
    const shape = e.target.dataset.shape; // вынули название шейпа из кнопки
    const action = e.target.dataset.action; // вынули название шейпа из кнопки
    const color = e.target.dataset.color; // вынули название шейпа из кнопки

    if (shape && classMap.hasOwnProperty(shape)) {
        const shapeClass = classMap[shape];
        const newShape = createShape(shapeClass, e.clientX, e.clientY);

        app.setCurrentShape(newShape);
    }

    if (action) {
        console.log('у этой кнопки есть экше');
        app.removeLastShape();
    }

    if (color) {
        console.log('у этой кнопки есть цвет');
        app.currentShape.setFillColor(color);
    }

});

window.addEventListener("load", onResize);
window.addEventListener("resize", onResize);

// Создает шейп с заданным классом и координатами
function createShape(Class, x, y) {
    var shape = new Class(x, y, currentSize);

    shape.setFillColor(currentFillColor);
    shape.setStrokeColor(currentStrokeColor);
    shape.setStrokeWidth(currentStrokeWidth);

    return shape;
}

// Фиксируем размер канваса при ресайзе
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}
