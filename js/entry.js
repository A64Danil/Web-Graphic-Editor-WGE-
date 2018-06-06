/**
 * Created by Данил on 04.06.2018.
 */
const canvas = document.getElementById('myCanvas'); // Выбираем канвас.
let canvasBgrColor = "#fff";

const app = new App(canvas, canvasBgrColor); // Запускаем приложение применительно к выбранному канвасу
const shapeMap = {
    circle: Circle,
    quad: Quad,
    triangle: Triangle,
    ereaserCircle: EreaserCircle,
    ereaserQuad: EreaserQuad,
    ereaserTriangle: EreaserTriangle,
    brushcircle: CircleBrush,
    brushquad: QuadBrush,
    line: Line
};

const brushMap = {
    circle: CircleBrush,
    quad: QuadBrush
};


let currentShapeClass;
let currentInHand;

let currentFillColor = "#C6BAEE";
let currentStrokeColor = currentFillColor;
let currentStrokeWidth = 1;

let tepmStrokeColor = currentStrokeColor;
let tepmStrokeWidth = currentStrokeWidth;

let currentSize = 100;
let currentIsStroke = false;

let isDrawing = false;


// Подключаем требуемые для рисования события
canvas.onmousedown = startDrawing;
canvas.onmouseup = stopDrawing;
canvas.onmouseout = stopDrawing;
canvas.onmousemove = draw;

function startDrawing(e) {
    // Начинаем рисовать
    console.log('начали рисовать');
    //console.log("isDrawing " + isDrawing);
    app.ctx.strokeStyle = "f00";
    app.ctx.lineWidth = 10;
    isDrawing = true;

}

function draw(e) {
    if (isDrawing == true)
    {
        //console.log("isDrawing" + isDrawing);

        // Определяем текущие координаты указателя мыши
        let oldX = e.clientX;
        let oldY = e.clientY;

        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;

        var x2 = x / 2;
        var y2 = y / 2;

        console.log('x: ' + e.clientX + ', y: ' + e.clientY);
        console.log('x: ' + x2 + ', y: ' + y2);

        const shapeClass = app.currentShape.constructor; // записываем класс шейпа в константу
        const shape = createShape(shapeClass, x, y, );

        app.addShape(app.currentShape); // добавляем в массив фигур нашего канваса текущий шейп;
        app.setCurrentShape(shape); // Говорим что новый шейп в руках - тот что нарисовали

    }
}

function stopDrawing() {
    console.log('закончили рисовать');
    isDrawing = false;
}


canvas.addEventListener("mousemove", function (e) {
    if (app.currentShape) {
        app.currentShape.setPosition(e.clientX, e.clientY)
    }
});

canvas.addEventListener('mousedown', dragAndPaint, true);

function dragAndPaint(e) {
    if (app.currentShape && currentInHand != 'shape') {
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
    const shape = target.dataset.shape; // вынули название шейпа из кнопки
    const brush = target.dataset.brush; // вынули название шейпа из кнопки
    const action = target.dataset.action; // вынули data
    const color = target.dataset.color;
    const size = target.dataset.size;
    const strokeWidth = target.dataset.strokeWidth;
    const isStroked = target.dataset.isstroke;
    const strokeColor = target.dataset.strokeColor;


    
    // Shape Form
    if (shape && shapeMap.hasOwnProperty(shape)) {
        const shapeClass = shapeMap[shape];


        currentShapeClass = shape;
        console.log(currentShapeClass);

        switch (currentShapeClass) {
            case 'brushcircle':
            case 'brushquad':
                console.log('В руках кисть - ' + currentShapeClass);
                currentInHand = 'brush';
                break;
            case 'circle':
            case 'quad':
            case 'triangle':
                console.log('В руках шейп - ' + currentShapeClass);
                currentInHand = 'shape';
                break;
            case 'ereaserCircle':
            case 'ereaserQuad':
            case 'ereaserTriangle':
                console.log('В руках ластик - ' + currentShapeClass);
                currentInHand = 'ereaser';
                break;
            default:
                console.log('В руках что-то еще - ' + currentShapeClass);
                currentInHand = currentShapeClass;
        }

        const newShape = createShape(shapeClass, e.clientX, e.clientY);
        app.setCurrentShape(newShape);
    }

    // Remove Last Shape
    if (action) {
        app.removeLastShape();
    }

    // Color
    if (color) {
        currentFillColor = color;
        if ( currentInHand == 'brush' && currentIsStroke == true )  {
            console.info('Обводка работает только для фигур');
            app.currentShape.setFillColor(currentFillColor);
            app.currentShape.setStrokeColor(currentFillColor);
        } else if (app.currentShape && currentIsStroke == false) {
            currentStrokeColor = currentFillColor = color;
            app.currentShape.setStrokeColor(currentFillColor);
            app.currentShape.setFillColor(currentFillColor);
        } else if (app.currentShape) {
            app.currentShape.setFillColor(currentFillColor);
            app.currentShape.setStrokeColor(currentStrokeColor);
        }
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
        currentStrokeColor = strokeColor;
        if (app.currentShape) {
            console.log('пытаемся поменять обводку текущего объекта в руках');
            app.currentShape.setStrokeColor(currentStrokeColor);
            app.currentShape.setStrokeWidth(currentStrokeWidth);
        }
    }

});

window.addEventListener("load", onResize);
window.addEventListener("resize", onResize);


// Создает шейп с заданным классом и координатами
function createShape(Class, x, y, x2, y2) {
    console.log("создаем шейп");
    var shape = new Class(currentSize, x, y, x2, y2);

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
