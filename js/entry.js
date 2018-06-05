/**
 * Created by Данил on 04.06.2018.
 */
const canvas = document.getElementById('myCanvas'); // Выбираем канвас.
let canvasBgrColor = "#fff";

const app = new App(canvas, canvasBgrColor); // Запускаем приложение применительно к выбранному канвасу
const classMap = {
    quad: Quad,
    circle: Circle,
    triangle: Triangle,
    ereaserCircle: EreaserCircle,
    ereaserQuad: EreaserQuad,
    ereaserTriangle: EreaserTriangle
};


let currentFillColor = "#C6BAEE";
let currentStrokeColor = currentFillColor;
let currentStrokeWidth = 1;

let tepmStrokeColor = currentStrokeColor;
let tepmStrokeWidth = currentStrokeWidth;

let currentSize = 100;
let currentIsStroke = false;


canvas.addEventListener("mousemove", function (e) {
    if (app.currentShape) {
        app.currentShape.setPosition(e.clientX, e.clientY)
    }
});

canvas.addEventListener('mousedown', dragAndPaint, true);

function dragAndPaint(e) {

    if (app.currentShape) {
        canvas.addEventListener('mousemove', moveAndPaint);
    }
}

function moveAndPaint(e) {
    if (e.which == 1) {
        const shapeClass = app.currentShape.constructor; // записываем класс шейпа в константу
        const shape = createShape(shapeClass, e.clientX, e.clientY);

        app.addShapeArray(app.currentShape); // добавляем в массив фигур нашего канваса текущий шейп;
        app.setCurrentShape(shape); // Говорим что новый шейп в руках - тот что нарисовали
    }
}

// canvas.addEventListener('mouseup', function(e) {
//     console.log('сняли событие с канваса');
//     canvas.removeEventListener('mousemove', moveAndPaint);
//     app.clearTmpShapeArr();
// });

// Drawing of shape
canvas.addEventListener('mouseup', function (e) {
    console.log('сняли событие с канваса', app.shapesInArr.length);
    canvas.removeEventListener('mousemove', moveAndPaint);

    if (app.currentShape && app.shapesInArr.length == 0) {
        const shapeClass = app.currentShape.constructor; // записываем класс шейпа в константу
        const shape = createShape(shapeClass, e.clientX, e.clientY);

        app.addShape(app.currentShape); // добавляем в массив фигур нашего канваса текущий шейп;
        app.setCurrentShape(shape); // Говорим что новый шейп в руках - тот что нарисовали
    }


    app.clearTmpShapeArr();
    //console.log(app.currentShape.constructor); //TODO: изучить другие свойства объекта
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

// Brush and Hand control
document.addEventListener("click", function (e) {
    let target = e.target;
    const shape = e.target.dataset.shape; // вынули название шейпа из кнопки
    const action = e.target.dataset.action; // вынули data
    const color = e.target.dataset.color;
    const size = e.target.dataset.size;
    const strokeWidth = e.target.dataset.strokeWidth;
    const isStroked = e.target.dataset.isstroke;
    const strokeColor = e.target.dataset.strokeColor;

    // Brush Form
    if (shape && classMap.hasOwnProperty(shape)) {
        const shapeClass = classMap[shape];
        const newShape = createShape(shapeClass, e.clientX, e.clientY);

        app.setCurrentShape(newShape);
    }

    // Remove Last Shape
    if (action) {
        app.removeLastShape();
    }

    // Color
    if (color) {

        currentStrokeColor = currentFillColor = color;
        if (app.currentShape && currentIsStroke == false) {
            app.currentShape.setStrokeColor(currentFillColor);
            app.currentShape.setFillColor(currentFillColor);
        } else if (app.currentShape) app.currentShape.setFillColor(currentFillColor);
    }

    // Size
    if (size) {
        console.log('у этой кнопки есть размер', size);
        currentSize = +size;
        if (app.currentShape) {app.currentShape.setSize(currentSize);}
    }

    // Is strokes?
    if (isStroked && isStroked == 0) {
        console.log('Рамка была отключена,' +  isStroked + ' включаем. Вр. цвет - ' + tepmStrokeColor + 'Шир.' + tepmStrokeWidth);
        currentIsStroke = true;
        target.dataset.isstroke = 1;
        currentStrokeColor = tepmStrokeColor;
        currentStrokeWidth = tepmStrokeWidth;
        if (app.currentShape) {app.currentShape.setIsStroke(currentIsStroke, currentStrokeColor,currentStrokeWidth);}

    }  else if (isStroked && isStroked == 1) {
        console.log('Рамка была вкключена,' +  isStroked + ' отключаем. Вр. цвет - ' + tepmStrokeColor + 'Шир.' + tepmStrokeWidth);
        currentIsStroke = false;
        target.dataset.isstroke = 0;
        tepmStrokeColor = currentStrokeColor;
        tepmStrokeWidth = currentStrokeWidth;
        currentStrokeWidth = 1;
        currentStrokeColor = currentFillColor;
        if (app.currentShape) {app.currentShape.setIsStroke(currentIsStroke, currentFillColor);}
    }

    // Stroke width
    if (strokeWidth && currentIsStroke == true) {
        console.log('у этой кнопки есть размер обводки', strokeWidth);
        currentStrokeWidth = +strokeWidth;
        if (app.currentShape) {app.currentShape.setStrokeWidth(currentStrokeWidth);}
    }

    // Stroke Color
    if (strokeColor && currentIsStroke == true) {
        console.log('у этой кнопки есть цвет обводки');
        currentStrokeColor = strokeColor;
        if (app.currentShape) {
            app.currentShape.setStrokeColor(currentStrokeColor);
            app.currentShape.setStrokeWidth(currentStrokeWidth);
        }
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
