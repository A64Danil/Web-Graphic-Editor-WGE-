/**
 * Created by ����� on 04.06.2018.
 */
const canvas = document.getElementById('myCanvas'); // �������� ������.
const app = new App(canvas); // ��������� ���������� ������������� � ���������� �������
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
        const shapeClass = app.currentShape.constructor; // ���������� ����� ����� � ���������
        const shape = createShape(shapeClass, e.clientX, e.clientY);

        app.addShape(app.currentShape); // ��������� � ������ ����� ������ ������� ������� ����;
        app.setCurrentShape(shape); // ������� ��� ����� ���� � ����� - ��� ��� ����������
    }
    console.log(app.currentShape.constructor); //TODO: ������� ������ �������� �������
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
        console.log('�� ������ �� esc, keyCode - ' + e.keyCode)
    }
});

// �������� ����� ���� �� ����-* ����� �����
document.addEventListener("click", function (e) {
    const shape = e.target.dataset.shape; // ������ �������� ����� �� ������
    const action = e.target.dataset.action; // ������ �������� ����� �� ������
    const color = e.target.dataset.color; // ������ �������� ����� �� ������

    if (shape && classMap.hasOwnProperty(shape)) {
        const shapeClass = classMap[shape];
        const newShape = createShape(shapeClass, e.clientX, e.clientY);

        app.setCurrentShape(newShape);
    }

    if (action) {
        console.log('� ���� ������ ���� ����');
        app.removeLastShape();
    }

    if (color) {
        console.log('� ���� ������ ���� ����');
        app.currentShape.setFillColor(color);
    }

});

window.addEventListener("load", onResize);
window.addEventListener("resize", onResize);

// ������� ���� � �������� ������� � ������������
function createShape(Class, x, y) {
    var shape = new Class(x, y, currentSize);

    shape.setFillColor(currentFillColor);
    shape.setStrokeColor(currentStrokeColor);
    shape.setStrokeWidth(currentStrokeWidth);

    return shape;
}

// ��������� ������ ������� ��� �������
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}
