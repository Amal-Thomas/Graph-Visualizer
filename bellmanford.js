function edge_loop(i, count) {
    setTimeout(() => {
        if (i == edges.length) {
            c.putImageData(imageData, 0, 0);
            mark_a_node(source);
            mark_a_node(destination);
            // canvas.addEventListener('click', restoreimage);
        } else {
            let edge = edges[i];
            console.log(graphxy, edge);
            let x1 = graphxy[parseInt(edge[0])][0];
            let y1 = graphxy[parseInt(edge[0])][1];
            let x2 = graphxy[parseInt(edge[1])][0];
            let y2 = graphxy[parseInt(edge[1])][1];

            if (directed) {
                let reverse = arc_reverse_identifier[JSON.stringify([edge[0], edge[1]])];
                mark_arc(x1 + offsetx, y1 + offsety, x2 + offsetx, y2 + offsety, reverse, true, "green");
            } else {
                mark_line(x1 + offsetx, y1 + offsety, x2 + offsetx, y2 + offsety, "green");
            }
        }
    }, 50 * count);
}

function path_loop(path, i, count) {
    setTimeout(() => {
        if (i == path.length - 1) {
            canvas.addEventListener('click', restoreimage);
            mark_a_node(source);
            mark_a_node(destination);
        } else {
            let node = path[i];
            console.log(path, node);
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
            console.log(count);
        }
    }, 50 * count);
}

function animatebellmanford(path) {
    let n = circleArray.length;
    let v = 0;
    let count = 0;
    while (v < 2 * (n - 1)) {
        let i = 0;
        while (i <= edges.length) {
            edge_loop(i, count);
            i++;
            count++;
        }

        v++;
    }
    let i = 1;
    while (i < path.length) {
        path_loop(path, i, count);
        i++;
        count++;
    }


}

function findShortestPath_negweight(edges, s, e) {
    [distance, prev] = bellmanford(edges, s);
    path = [];
    if (distance[e - 1] == Infinity) {
        return [distance, path];
    } else if (distance[e - 1] == -Infinity) {
        return [distance, path];
    }
    let at = parseInt(e);
    while (at != null) {
        path.unshift(at);
        at = prev[at - 1];
    }
    return [distance, path];
}

function bellmanford(edges, s) {
    n = circleArray.length;
    let distance = new Array(n).fill(Infinity);
    let prev = new Array(n).fill(null);
    distance[s - 1] = 0;

    let v = 1;
    while (v < n) {
        for (let edge of edges) {
            console.log(edge);
            console.log(distance[edge[0] - 1] + parseInt(edge[2]), distance[edge[1] - 1]);
            if (distance[edge[0] - 1] + parseInt(edge[2]) < distance[edge[1] - 1]) {
                distance[edge[1] - 1] = distance[edge[0] - 1] + parseInt(edge[2]);
                prev[edge[1] - 1] = edge[0];
            }
        }
        v = v + 1;
        console.log(distance);
    }

    v = 1;
    while (v < n) {
        for (let edge of edges) {
            if (distance[edge[0] - 1] + parseInt(edge[2]) < distance[edge[1] - 1]) {
                distance[edge[1] - 1] = -Infinity;
                prev[edge[1] - 1] = edge[0];
            }
        }
        v = v + 1;
    }

    return [distance, prev];
}