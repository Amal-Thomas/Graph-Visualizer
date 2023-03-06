class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(element, priority) {
        this.queue.push({ element, priority });
        this.sortQueue();
    }

    dequeue() {
        return this.queue.shift();
    }

    sortQueue() {
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}


function animatedijkstra() {
    console.log("lets get this going");
    console.log(traversal);
    console.log(path);
    console.log(distance);
    console.log("woohoo");
}
var distance = [];
var prev = [];

function findShortestPath(g, s, e) {
    [traversal, distance, prev] = dijkstra(g, s, e);
    path = [];
    if (distance[e - 1] == Infinity) {
        return [traversal, distance, path];
    }
    let at = parseInt(e);
    while (at != null) {
        path.unshift(at);
        at = prev[at - 1];
    }
    console.log(traversal, distance, path);
    traversal.pop();
    return [traversal, distance, path];
}

function dijkstra(g, s, e) {
    var n = circleArray.length;
    let vis = new Array(n).fill(false);
    let prev = new Array(n).fill(null);
    let distance = new Array(n).fill(Infinity);
    let traversal = [];
    distance[s - 1] = 0
    let pq = new PriorityQueue();
    pq.enqueue(s, 0);
    while (pq.queue.length != 0) {
        let minValue_index = pq.dequeue();
        console.log(minValue_index);
        let minValue = minValue_index.priority;
        let index = parseInt(minValue_index.element);
        traversal.push(index);
        vis[index - 1] = true;
        if (distance[index - 1] < minValue) {
            continue;
        }
        console.log(index, g);
        for (let edge of g[index]) {
            if (vis[parseInt(edge[0]) - 1]) {
                continue;
            }
            let newDist = distance[index - 1] + parseInt(edge[1]);
            if (newDist < distance[parseInt(edge[0]) - 1]) {
                prev[parseInt(edge[0]) - 1] = index;
                distance[parseInt(edge[0]) - 1] = newDist;
                pq.enqueue(parseInt(edge[0]), newDist);
            }
        }
        if (index == e) {
            return [traversal, distance, prev];
        }
    }
    return [traversal, distance, prev]

}