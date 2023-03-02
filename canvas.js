var canvas = document.querySelector('canvas');
var buttons = document.querySelectorAll("button");
var navbar = document.querySelector("ul");
var weightinput = document.getElementById("weightinput");
var weightinputbutton = document.getElementById("weightinputbutton");
navbar.style.height = "60px";
canvas.style.borderColor = "white";

const mark_color = "#243763";
const travel_color = "#FBC252";

var undo = [];

var button1 = buttons[0]; //Insert Nodes
var button2 = buttons[1]; //Insert Edges
var button3 = buttons[3]; //DFT
var button4 = buttons[4]; //BFT
var button5 = buttons[5]; //Shortest Path
var button6 = buttons[6]; //Visualize
var button7 = buttons[7]; //Reset
var button8 = buttons[8]; //Undo

button1.addEventListener('mouseover', function () {
    button1.style.backgroundColor = "#FD8A8A";
    button1.style.color = "white";
})
button1.addEventListener('mouseout', function () {
    if (!(button1_active)) {
        button1.style.backgroundColor = "white";
        button1.style.color = "#FD8A8A";
    }
})

button2.addEventListener('mouseover', function () {
    button2.style.backgroundColor = "#A084DC";
    button2.style.color = "white";
})
button2.addEventListener('mouseout', function () {
    if (!(button2_active)) {
        button2.style.backgroundColor = "white";
        button2.style.color = "#A084DC";
    }
})

button3.addEventListener('mouseover', function () {
    button3.style.backgroundColor = "#F55050";
    button3.style.color = "white";
})
button3.addEventListener('mouseout', function () {
    if (!(button3_active)) {
        button3.style.backgroundColor = "white";
        button3.style.color = "#F55050";
    }
})

button4.addEventListener('mouseover', function () {
    button4.style.backgroundColor = "#F55050";
    button4.style.color = "white";
})
button4.addEventListener('mouseout', function () {
    if (!(button4_active)) {
        button4.style.backgroundColor = "white";
        button4.style.color = "#F55050";
    }
})

button5.addEventListener('mouseover', function () {
    button5.style.backgroundColor = "#F55050";
    button5.style.color = "white";
})
button5.addEventListener('mouseout', function () {
    if (!(button5_active)) {
        button5.style.backgroundColor = "white";
        button5.style.color = "#F55050";
    }
})


var button1_active = false;
var button2_active = false;
var button3_active = false;
var button4_active = false;
var button5_active = false;
var button6_active = false;
var button7_active = false;
var button8_active = false;

var weighted = false;
var directed = false;

var lightup = document.getElementsByClassName('toggles');
var weighted_check = document.getElementById('checkw');
var directed_check = document.getElementById('checkd');
directed_text = lightup[0]
weighted_text = lightup[1]

canvas.width = window.innerWidth * 0.75 - 2;
canvas.height = window.innerHeight - 102;
canvas.style.left = "25%";
canvas.style.top = "100px";
canvas.style.position = "absolute";
canvas.setAttribute('willReadFrequently', '');

var offsetx = window.innerWidth * 0.25;
var offsety = 100;

var c = canvas.getContext('2d', { willReadFrequently: true });
var imageData = c.getImageData(0, 0, canvas.width, canvas.height);

c.font = "30px Arial";
c.lineWidth = 3;

var graph = {};
var graphxy = {};
var edges = [];
var circleArray = [];

var position_error_flag = true;

const first_state = [imageData, {}, {}, [], []];
undo.push(first_state);

function undo_update() {
    if (undo.length > 100) {
        undo.shift();
    }
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    undo.push([imageData, JSON.parse(JSON.stringify(graph)), JSON.parse(JSON.stringify(graphxy)), [...edges], [...circleArray]]);
}

directed_check.addEventListener("change", function () {
    if (directed_check.checked) {
        directed_text.style.opacity = "100%";
        directed_text.style.color = "#AAFF00";
        directed = true;
    }
    else {
        directed_text.style.opacity = "30%";
        directed_text.style.color = "white";
        directed = false;
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    graph = {};
    graphxy = {};
    edges = [];
    circleArray = [];
    undo = [];
    undo_update();
});

weighted_check.addEventListener("change", function () {
    if (weighted_check.checked) {
        weighted_text.style.opacity = "100%";
        weighted_text.style.color = "#AAFF00";
        weighted = true;
        button5.innerText = "Shortest Path\n (Dijkstra's / Bellman Ford)";
    }
    else {
        weighted_text.style.opacity = "30%";
        weighted_text.style.color = "white";
        weighted = false;
        button5.innerText = "Shortest Path (BFS)";
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    graph = {};
    graphxy = {};
    edges = [];
    circleArray = [];
    undo = [];
    undo_update();
});

function over_a_node(x, y) {
    x = x - offsetx;
    y = y - offsety;
    for (const xy in graphxy) {
        let centerx = graphxy[xy][0];
        let centery = graphxy[xy][1];
        if (Math.pow(centerx - x, 2) + Math.pow(centery - y, 2) < 900) {
            return [xy, circleArray[xy - 1]];
        }
    }
    return null;
}

var imageData = c.getImageData(0, 0, canvas.width, canvas.height);

var mouse = {
    x: undefined,
    y: undefined
}

class Circle {
    constructor(x, y, radius) {
        this.x = x - offsetx;
        this.y = y - offsety;
        this.radius = radius;

        this.draw = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = "white";
            c.fill();
            c.strokeStyle = "black";
            c.stroke();
        };
    }
}

var circle;

function insert_node(event) {
    if (button1_active == true) {
        mouse.x = event.x;
        mouse.y = event.y;
        circle = new Circle(mouse.x, mouse.y, 30)
        circleArray.push(circle);
        circle.draw();
        c.fillStyle = "black";
        let text = circleArray.length.toString();
        if (position_error_flag) {
            c.fillText(text, circle.x - 8, circle.y + 15);
            position_error_flag = false;
        }
        else { c.fillText(text, circle.x, circle.y + 15); }
        c.textAlign = "center";
        graph[circleArray.length] = []
        graphxy[circleArray.length] = [circle.x, circle.y]
        undo_update();
    }
}
var prevx = 0;
var prevy = 0;
var fixedx = 0;
var fixedy = 0;

function dist(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}

function draw_arc(x1, y1, x2, y2, reverse, weight, edge) {
    c.beginPath();
    let ccw = false;
    let d = dist(x1, y1, x2, y2)

    let f = d / 5;
    if (f > 10) {
        f = 10;
    }
    let arc_radius = d * d / (8 * f) + f / 2;
    let m = (y1 - y2) / (x1 - x2);
    let theta_m_inv = Math.atan(-1 / m);
    let arrow = 0;
    let arrowx = 0;
    let arrowy = 0;
    let weightx = 0;
    let weighty = 0;
    let weight_offset = 10;
    let weight_error_flag = false;
    if (reverse) {

        let arc_x = (x1 + x2) / 2 - (arc_radius - f) * Math.cos(theta_m_inv);
        let arc_y = (y1 + y2) / 2 - (arc_radius - f) * Math.sin(theta_m_inv);
        let m1 = (y1 - arc_y) / (x1 - arc_x);
        let m2 = (y2 - arc_y) / (x2 - arc_x);
        let arc_end = Math.atan(m1);
        let arc_start = Math.atan(m2);
        let d_arc = 32 / arc_radius;
        if (x2 < x1) {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_start = arc_start + Math.PI;
                weight_error_flag = true;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_start = arc_start - Math.PI;
                weight_error_flag = true;
            }
        }
        else {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_end = arc_end + Math.PI;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_end = arc_end - Math.PI;
            }
        }

        if (y2 > y1) {
            ccw = true;
            d_arc = -d_arc;
        }

        c.arc(arc_x - offsetx, arc_y - offsety, arc_radius, arc_start + d_arc, arc_end - d_arc, ccw);
        arrow = arc_start + d_arc;
        arrowx = arc_x - offsetx + arc_radius * Math.cos(arrow);
        arrowy = arc_y - offsety + arc_radius * Math.sin(arrow);



        weightx = arc_x - offsetx + (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
        weighty = arc_y - offsety + (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);

        if (weighty > arc_y - offsety) weighty = weighty + 15;

        if (weight_error_flag) {
            weightx = arc_x - offsetx - (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
            weighty = arc_y - offsety - (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);
        }

        if (y2 > y1) {
            arrow = arrow - Math.PI;
        }
        arrow = arrow - Math.PI;
    }
    else {

        let arc_x = (x1 + x2) / 2 + (arc_radius - f) * Math.cos(theta_m_inv);
        let arc_y = (y1 + y2) / 2 + (arc_radius - f) * Math.sin(theta_m_inv);
        let m1 = (y1 - arc_y) / (x1 - arc_x);
        let m2 = (y2 - arc_y) / (x2 - arc_x);
        let arc_start = Math.PI + Math.atan(m1);
        let arc_end = Math.PI + Math.atan(m2);
        let d_arc = 32 / arc_radius;
        if (x2 < x1) {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_start = arc_start + Math.PI;
                weight_error_flag = true;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_start = arc_start - Math.PI;
                weight_error_flag = true;
            }


        }
        else {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_end = arc_end + Math.PI;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_end = arc_end - Math.PI;
            }

        }
        if (y2 > y1) {
            ccw = true;
            d_arc = -d_arc;
        }
        c.arc(arc_x - offsetx, arc_y - offsety, arc_radius, arc_start + d_arc, arc_end - d_arc, ccw);
        arrow = arc_end - d_arc;

        arrowx = arc_x - offsetx + arc_radius * Math.cos(arrow);
        arrowy = arc_y - offsety + arc_radius * Math.sin(arrow);

        weightx = arc_x - offsetx + (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
        weighty = arc_y - offsety + (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);

        if (weighty >= arc_y - offsety) weighty = weighty + 15;

        if (weight_error_flag) {
            weightx = arc_x - offsetx - (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
            weighty = arc_y - offsety - (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);
        }


        if (y2 > y1) {
            arrow = arrow - Math.PI;
        }
    }


    c.strokeStyle = "#FF6363";
    c.stroke();

    c.save();
    c.translate(arrowx, arrowy);
    c.rotate(arrow);
    c.font = "20px serif";
    c.fillStyle = "#FF6363";
    c.fillText('\u25BC', 0, 0);
    c.restore();

    if (weighted) {
        weightinput.value = "";
        weightinput.focus();
        function drawweight() {
            weight = weightinput.value;
            c.save();
            c.translate(weightx, weighty);
            c.font = "20px sans-serif";
            c.fillStyle = "black";
            c.fillText(weight, 0, 0);
            c.restore();
            weightinputbutton.removeEventListener('click', drawweight);
            document.removeEventListener('keypress', drawweightenter);

            graph[edge[0]].push([edge[1], weight]);

            undo_update();
            if (button2_active == true) {
                button2_repeat();
            }
        }

        function drawweightenter(event) {
            if (event.key == 'Enter') {
                drawweight();
            }
        }
        weightinputbutton.addEventListener('click', drawweight);
        document.addEventListener('keypress', drawweightenter);
    }
    else {
        graph[edge[0]].push(edge[1]);
        undo_update();
        if (button2_active == true) {
            button2_repeat();
        }
    }
}

function draw(x1, y1, x2, y2, finish_edge, edge) {
    c.beginPath();

    if (x1 - x2 == 0) {
        r = 30;
        if (y1 - y2 > 0) {
            r = -30;
        }
        c.moveTo(x1 - offsetx, y1 - offsety + r);
    }
    else {
        let m = (y1 - y2) / (x1 - x2);
        let theta = Math.atan(m);
        r = 30;
        if (x1 - x2 < 0) {
            r = -30;
        }

        c.moveTo(x1 - offsetx - r * Math.cos(theta), y1 - offsety - r * Math.sin(theta));
    }

    if (finish_edge == true) {
        if (x1 - x2 == 0) {
            r = 30;
            if (y1 - y2 > 0) {
                r = -30;
            }
            c.lineTo(x2 - offsetx, y2 - offsety - r);
        }
        else {
            let m = (y1 - y2) / (x1 - x2);
            let theta = Math.atan(m);
            r = 30;
            if (x1 - x2 < 0) {
                r = -30;
            }

            c.lineTo(x2 - offsetx + r * Math.cos(theta), y2 - offsety + r * Math.sin(theta));
        }

        if (weighted) {
            weightinput.value = "";
            weightinput.focus();
            function drawweight() {
                weight = weightinput.value;
                c.save();
                let weightoffsetx = 15;
                let weightoffsety = 5;
                c.translate((x1 + x2) / 2 - offsetx - weightoffsetx, (y1 + y2) / 2 - offsety - weightoffsety);
                c.font = "20px sans-serif";
                c.fillStyle = "black";
                c.fillText(weight, 0, 0);
                c.restore();
                weightinputbutton.removeEventListener('click', drawweight);
                document.removeEventListener('keypress', drawweightenter);

                graph[edge[0]].push([edge[1], weight]);
                graph[edge[1]].push([edge[0], weight]);

                undo_update();
                if (button2_active == true) {
                    button2_repeat();
                }
            }

            function drawweightenter(event) {
                if (event.key == 'Enter') {
                    drawweight();
                }
            }
            weightinputbutton.addEventListener('click', drawweight);
            document.addEventListener('keypress', drawweightenter);
        }
        else {
            c.strokeStyle = "#FF6363";
            c.stroke();

            graph[edge[0]].push(edge[1]);
            graph[edge[1]].push(edge[0]);

            undo_update();
            imageData = c.getImageData(0, 0, canvas.width, canvas.height);
            if (button2_active == true) {
                button2_repeat();
            }
        }
    }
    else {
        c.lineTo(x2 - offsetx, y2 - offsety);
    }
    c.strokeStyle = "#FF6363";
    c.stroke();


}

var draw_edge = false;

function animate() {
    if (button2_active == true && draw_edge == true) {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.putImageData(imageData, 0, 0);
        draw(fixedx, fixedy, movex, movey, false, null);
    }
}

function insert_edge(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    let id_current_node = over_a_node(mouse.x, mouse.y);
    let id = id_current_node[0];
    let current_node = id_current_node[1];
    edges.push([id])

    canvas.removeEventListener('click', insert_edge);

    movex = mouse.x
    movey = mouse.y

    fixedx = current_node.x + offsetx;
    fixedy = current_node.y + offsety;

    draw_edge = true;

    canvas.addEventListener('mousemove', trace_path);
    animate();
    canvas.addEventListener('click', last);
}


var movex = 0;
var movey = 0;

function trace_path(event) {
    movex = event.x;
    movey = event.y;
}

var weight = null;

function last(event) {
    draw_edge = false;
    let id_current_node = over_a_node(event.x, event.y);
    let id = null;
    let current_node = null;
    let duplicate_detected = false;
    if (!(id_current_node == null)) {
        id = id_current_node[0];
        current_node = id_current_node[1];
        for (const element of graph[edges[edges.length - 1][0]]) {
            if (element == id) {
                duplicate_detected = true;
            }
        }
    }
    if (duplicate_detected) {
        edges.pop();
        c.putImageData(imageData, 0, 0);

        c.clearRect(0, 0, canvas.width, canvas.height);
        c.putImageData(imageData, 0, 0);

        canvas.removeEventListener('mousemove', trace_path);
        canvas.removeEventListener('click', last);


        if (button2_active == true) {
            button2_repeat();
        }
    } else if (id == edges[edges.length - 1][0]) {
        edges.pop();
        c.putImageData(imageData, 0, 0);

        c.clearRect(0, 0, canvas.width, canvas.height);
        c.putImageData(imageData, 0, 0);

        canvas.removeEventListener('mousemove', trace_path);
        canvas.removeEventListener('click', last);


        if (button2_active == true) {
            button2_repeat();
        }
    } else if (id == null) {
        edges.pop();

        c.clearRect(0, 0, canvas.width, canvas.height);
        c.putImageData(imageData, 0, 0);

        canvas.removeEventListener('mousemove', trace_path);
        canvas.removeEventListener('click', last);


        c.putImageData(imageData, 0, 0);
        if (button2_active == true) {
            button2_repeat();
        }
    } else {


        edges[edges.length - 1].push(id);

        movex = current_node.x + offsetx;
        movey = current_node.y + offsety;

        c.clearRect(0, 0, canvas.width, canvas.height);
        c.putImageData(imageData, 0, 0);

        let edge = edges[edges.length - 1];
        let reverse = false;

        weight = null;

        canvas.removeEventListener('mousemove', trace_path);
        canvas.removeEventListener('click', last);

        if (directed == false) {
            draw(fixedx, fixedy, movex, movey, true, edge);
        }
        else {
            if (weighted) {
                if (edge[1] in graph) {
                    for (const edge_weight of graph[edge[1]]) {
                        if (edge[0] == edge_weight[0]) {
                            reverse = true;
                        }
                    }

                }
            } else {
                if (graph[edge[1]].includes(edge[0])) {
                    reverse = true;
                }
            }
            draw_arc(fixedx, fixedy, movex, movey, reverse, weight, edge);
        }
    }

}

button1.addEventListener('click', function () {
    c.putImageData(imageData, 0, 0);
    canvas.addEventListener('click', insert_node);
    button1_active = true;
    button1.style.backgroundColor = "#FD8A8A";
    button1.style.color = "white";
    button2.style.backgroundColor = "white";
    button2.style.color = "#A084DC";
    button3_active = false;
    button3.style.backgroundColor = "white";
    button3.style.color = "#F55050";
    button4_active = false;
    button4.style.backgroundColor = "white";
    button4.style.color = "#F55050";
    button5_active = false;
    button5.style.backgroundColor = "white";
    button5.style.color = "#F55050";
    button6_active = false;
    button7_active = false;
    button8_active = false;

    button6.disabled = true;

    if (button2_active) {
        canvas.removeEventListener('click', insert_edge);
        button2_active = false;
    }
});


function button2_repeat() {
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    canvas.addEventListener('click', insert_edge);
    button1_active = false;
    button1.style.backgroundColor = "white";
    button1.style.color = "#FD8A8A";
    button2_active = true;
    button2.style.backgroundColor = "#A084DC";
    button2.style.color = "white";
    button3_active = false;
    button3.style.backgroundColor = "white";
    button3.style.color = "#F55050";
    button4_active = false;
    button4.style.backgroundColor = "white";
    button4.style.color = "#F55050";
    button5_active = false;
    button5.style.backgroundColor = "white";
    button5.style.color = "#F55050";
    button6_active = false;
    button7_active = false;
    button8_active = false;

    button6.disabled = true;

    animate();
    button2.click();
}

var first_done = false;

button2.addEventListener('click', function () {
    c.putImageData(imageData, 0, 0);
    button2_repeat();
});

function depthfirsttraversal(source, visited) {
    const stack = [source.toString()];
    let dfs = [];
    while (stack.length > 0) {
        var current = stack.pop();
        if (visited.has(current)) {
            continue;
        }
        dfs.push(current);
        visited.add(current);
        for (let neighbor of graph[current]) {
            if (weighted) neighbor = neighbor[0];
            stack.push(neighbor);
        }
    }
    return dfs;
}

function breadthfirsttraversal(source, visited) {
    const queue = [source.toString()];
    let bfs = [];
    while (queue.length > 0) {
        var current = queue.shift();
        if (visited.has(current)) {
            continue;
        }
        if ((button5_active) && (current == destination)) {
            return bfs;
        }
        bfs.push(current);
        visited.add(current);
        for (let neighbor of graph[current]) {
            if (weighted) neighbor = neighbor[0];
            queue.push(neighbor);
        }
    }
    return bfs;
}

function bfs_solve(source) {
    let q = [];
    q.push(source)

    n = circleArray.length;
    visited = new Array(n).fill(false);
    visited[parseInt(source) - 1] = true;

    let prev = new Array(n).fill(null);

    while (q.length > 0) {
        node = q.shift();
        neighbours = graph[node];

        for (let neighbour of neighbours) {
            if (!(visited[parseInt(neighbour) - 1])) {
                q.push(neighbour);
                visited[parseInt(neighbour) - 1] = true;
                prev[parseInt(neighbour) - 1] = node;
            }
        }
    }
    return prev
}

function reconstructPath(source, end, prev) {
    path = [];
    at = end;
    while (at) {
        path.unshift(at);
        at = prev[parseInt(at) - 1];
    }
    if (path[0] == source) {
        return path;
    }
    return [];
}

function breadthfirstsearch(source, end) {
    source = source.toString();
    end = end.toString();
    let prev = bfs_solve(source);
    return reconstructPath(source, end, prev);
}

var traversal = [];
var path = [];

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function animatetraversal() {
    canvas.removeEventListener('click', restoreimage);
    var i = 1;
    if (button5_active) {
        if (path.length == 0) {
            while (i <= traversal.length) {
                loop(i);
                i++;
            }
        }
        else {
            while (i <= traversal.length + path.length - 2) {
                loop(i);
                i++;
            }
        }
    }
    else {
        while (i <= traversal.length) {
            loop(i);
            i++;
        }
    }
}

function restoreimage() {
    c.putImageData(imageData, 0, 0);
    canvas.removeEventListener('click', restoreimage);
}

function mark_a_node(node) {
    let nodex = graphxy[parseInt(node)][0];
    let nodey = graphxy[parseInt(node)][1];
    c.beginPath();
    c.arc(nodex, nodey, 31, 0, Math.PI * 2, false);
    c.fillStyle = mark_color;
    c.fill();
    c.strokeStyle = mark_color;
    c.stroke();
    c.fillStyle = "white";
    c.fillText(node, nodex, nodey + 15);
    c.textAlign = "center";
}

function loop(i) {
    setTimeout(() => {
        if ((i == traversal.length) && (button5_active == false)) {
            canvas.addEventListener('click', restoreimage);
        }
        else if ((i == traversal.length) && (path.length == 0)) {
            canvas.addEventListener('click', restoreimage);
        }
        else if ((i == traversal.length + path.length - 2) && (button5_active == true) && (path.length > 0)) {
            canvas.addEventListener('click', restoreimage);
        }
        else if (i < traversal.length) {
            let node = traversal[i];
            let nodex = graphxy[parseInt(node)][0];
            let nodey = graphxy[parseInt(node)][1];

            c.beginPath();
            c.arc(nodex, nodey, 31, 0, Math.PI * 2, false);
            c.fillStyle = travel_color;
            c.fill();
            c.strokeStyle = travel_color;
            c.stroke();
            c.fillStyle = "white";
            c.fillText(node, nodex, nodey + 15);
            c.textAlign = "center";
        }
        else {
            let node = path[i - traversal.length + 1];
            let nodex = graphxy[parseInt(node)][0];
            let nodey = graphxy[parseInt(node)][1];

            c.beginPath();
            c.arc(nodex, nodey, 31, 0, Math.PI * 2, false);
            c.fillStyle = "#FF6E31";
            c.fill();
            c.strokeStyle = "#FF6E31";
            c.stroke();
            c.fillStyle = "white";
            c.fillText(node, nodex, nodey + 15);
            c.textAlign = "center";
        }
    }, 500 * i);
}

var source = 1;
var destination = 1;
var source_selected = false;

function select_source(event) {
    source_selected = false;
    let sourcelist = over_a_node(event.x, event.y);
    c.putImageData(imageData, 0, 0);
    if ((!(sourcelist == null)) && (button3_active == true)) {
        source = sourcelist[0];
        traversal = depthfirsttraversal(source, new Set());
        mark_a_node(source);
        button6.disabled = false;

    }
    if ((!(sourcelist == null)) && (button4_active == true)) {
        source = sourcelist[0];
        traversal = breadthfirsttraversal(source, new Set());
        mark_a_node(source);
        button6.disabled = false;
    }
    if ((!(sourcelist == null)) && (button5_active == true)) {
        source = sourcelist[0];
        mark_a_node(source);
        canvas.removeEventListener('click', select_source);
        source_selected = true;
        canvas.addEventListener('click', select_destination);
    }
}

function select_destination(event) {
    if ((button5_active == true) && source_selected) {
        let destinationlist = over_a_node(event.x, event.y);
        if (destinationlist == null) {
            c.putImageData(imageData, 0, 0);
            canvas.removeEventListener('click', select_destination);
            canvas.addEventListener('click', select_source);
        }
        else {
            destination = destinationlist[0];
            traversal = breadthfirsttraversal(source, new Set());
            mark_a_node(destination);
            path = breadthfirstsearch(source, destination);
            button6.disabled = false;
            canvas.removeEventListener('click', select_destination);
            canvas.addEventListener('click', select_source);
        }
    }
}

button3.addEventListener('click', function () {
    canvas.removeEventListener('click', insert_node);
    canvas.removeEventListener('click', insert_edge);
    canvas.removeEventListener('click', restoreimage);
    c.putImageData(imageData, 0, 0);
    button1_active = false;
    button1.style.backgroundColor = "white";
    button1.style.color = "#FD8A8A";
    button2_active = false;
    button2.style.backgroundColor = "white";
    button2.style.color = "#A084DC";
    button3_active = true;
    button3.style.backgroundColor = "#F55050";
    button3.style.color = "white";
    button4_active = false;
    button4.style.backgroundColor = "white";
    button4.style.color = "#F55050";
    button5_active = false;
    button5.style.backgroundColor = "white";
    button5.style.color = "#F55050";
    button6_active = false;
    button7_active = false;
    button8_active = false;
    button6.disabled = true;
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    traversal = [];
    canvas.addEventListener('click', select_source);
});

button4.addEventListener('click', function () {
    canvas.removeEventListener('click', insert_node);
    canvas.removeEventListener('click', insert_edge);
    canvas.removeEventListener('click', restoreimage);
    c.putImageData(imageData, 0, 0);
    button1_active = false;
    button1.style.backgroundColor = "white";
    button1.style.color = "#FD8A8A";
    button2_active = false;
    button2.style.backgroundColor = "white";
    button2.style.color = "#A084DC";
    button3_active = false;
    button3.style.backgroundColor = "white";
    button3.style.color = "#F55050";
    button4_active = true;
    button4.style.backgroundColor = "#F55050";
    button4.style.color = "white";
    button5_active = false;
    button5.style.backgroundColor = "white";
    button5.style.color = "#F55050";
    button6_active = false;
    button7_active = false;
    button8_active = false;
    button6.disabled = true;
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    traversal = [];
    canvas.addEventListener('click', select_source);
})

button5.addEventListener('click', function () {
    canvas.removeEventListener('click', insert_node);
    canvas.removeEventListener('click', insert_edge);
    canvas.removeEventListener('click', restoreimage);

    c.putImageData(imageData, 0, 0);
    button1_active = false;
    button1.style.backgroundColor = "white";
    button1.style.color = "#FD8A8A";
    button2_active = false;
    button2.style.backgroundColor = "white";
    button2.style.color = "#A084DC";
    button3_active = false;
    button3.style.backgroundColor = "white";
    button3.style.color = "#F55050";
    button4_active = false;
    button4.style.backgroundColor = "white";
    button4.style.color = "#F55050";
    button5_active = true;
    button5.style.backgroundColor = "#F55050";
    button5.style.color = "white";
    button6_active = false;
    button7_active = false;
    button8_active = false;
    button6.disabled = true;
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    traversal = [];
    path = [];
    canvas.addEventListener('click', select_source);
})

button6.addEventListener('click', function () {
    button1_active = false;
    button1.style.backgroundColor = "white";
    button1.style.color = "#FD8A8A";
    button2_active = false;
    button2.style.backgroundColor = "white";
    button2.style.color = "#A084DC";

    animatetraversal();

    console.log(graph);
    console.log(edges);
})

button7.addEventListener('click', function () {
    c.putImageData(imageData, 0, 0);
    button1_active = false;
    button1.style.backgroundColor = "white";
    button1.style.color = "#FD8A8A";
    button2_active = false;
    button2.style.backgroundColor = "white";
    button2.style.color = "#A084DC";
    button3_active = false;
    button4_active = false;
    button5_active = false;
    button6_active = false;
    button7_active = true;
    button8_active = false;

    c.clearRect(0, 0, canvas.width, canvas.height);
    imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    graph = {};
    graphxy = {};
    edges = [];
    circleArray = [];
    undo_update();
})

button8.addEventListener('click', function () {
    c.putImageData(imageData, 0, 0);

    undo.pop();
    let last_state = undo[undo.length - 1];
    imageData = last_state[0];
    graph = JSON.parse(JSON.stringify(last_state[1]));
    graphxy = JSON.parse(JSON.stringify(last_state[2]));
    edges = [...last_state[3]];
    circleArray = [...last_state[4]];
    c.putImageData(imageData, 0, 0);
})