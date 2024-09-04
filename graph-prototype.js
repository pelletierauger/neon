// --------------------------------------------------------------------
// Graph
// --------------------------------------------------------------------

let Graph = function() {
    this.vertices = [];
    this.edges = [];
    this.walkers = [];
};

// --------------------------------------------------------------------
// Vertex
// --------------------------------------------------------------------

let Vertex = function(x, y, z, g) {
    this.pos = { x: x, y: y, z: z };
    this.note = random([0, 2, 3, 5, 7, 8, 10]);
    this.edges = [];
    this.lastVisited = 0;
    g.vertices.push(this);
};

Vertex.prototype.addEdge = function(e) {
    this.edges.push(e);
};

Vertex.prototype.posArray = function() {
    return [this.pos.x, this.pos.y, this.pos.z];
};

// --------------------------------------------------------------------
// Edges
// --------------------------------------------------------------------

let Edge = function(a, b, g) {
    this.a = a;
    this.b = b;
    this.fire = 0;
    a.addEdge(this);
    b.addEdge(this);
    g.edges.push(this);
};

Edge.prototype.show = function() {
    // line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/5,
        1, 0, 0, 0.0001
    );
    add3DLine(
        this.a.pos.x, this.a.pos.y, 1,
        this.b.pos.x, this.b.pos.y, 1,
        1/45,
        1, 0, 0, 0.1
    );
};

// --------------------------------------------------------------------
// Walker
// --------------------------------------------------------------------

let Walker = function(v, g) {
    this.v = v;
    this.e = null;
    this.graph = g;
    this.goalV = null;
    this.distanceToWalk = null;
    this.walking = false;
    this.speed = 0.01;
    this.graph.walkers.push(this);
    this.extraVelocity = 0;
    this.sleeping = false;
};

Walker.prototype.teleport = function() {
    let newVertex;
    do {
        newVertex = random(his.graph.vertices);
    } while (newVertex.edges.length < 1);
    this.v = newVertex;
    this.goalV = null;
    this.distanceToWalk = null;
    this.walking = false;
    this.singing = false;
    this.speed = 0.0075;
    this.extraVelocity = 0;
};

Walker.prototype.startWalking = function() {
    // if (this.v.edges) {
    //     let r = floor(random(this.v.edges.length));
    //     if (this.v.edges[r].a == this.v) {
    //         this.goalV = this.v.edges[r].b;
    //     } else {
    //         this.goalV = this.v.edges[r].a;
    //     }
    // }
    if (this.v.edges) {
        let oldest = Infinity;
        let chosen = null;
        let chosenEdge = null;
        for (let i = 0; i < this.v.edges.length; i++) {
            let other;
            if (this.v.edges[i].a == this.v) {
                other = this.v.edges[i].b;
            } else {
                other = this.v.edges[i].a;
            }
            if (other.lastVisited < oldest) {
                oldest = other.lastVisited;
                chosen = other;
                chosenEdge = this.v.edges[i];
            }
        }
        if (chosen) {
            this.goalV = chosen;
            if (this.e) {
                this.e.fire = 1;
            }
            this.e = chosenEdge;
        }
    }
    this.extraVelocity = 0.006*2;
    this.walking = true;
    this.walked = 0;
    this.distanceToWalk = dist(this.v.pos.x, this.v.pos.y, this.goalV.pos.x, this.goalV.pos.y);
};

Walker.prototype.walk = function() {
    this.walked += this.speed + this.extraVelocity;
    if (this.extraVelocity) {
        this.extraVelocity *= 0.9;
    }
    // this.e.fire += this.speed*10;
    if (this.walked >= this.distanceToWalk) {
        this.walking = false;
        this.v = this.goalV;
        this.v.lastVisited = drawCount;
        this.goalV = null;
        this.sing();
        if (!this.sleeping) {
            this.startWalking();
        }
    }
};

Walker.prototype.sing = function() {
    // let osc = song.getFrequency(this.v.freq);
    // if (Math.random() < 0.1) {
    
    this.singing = true;
    let rotateX = drawCount*0.25e-2 * -1;
    let rotateY = -drawCount*0.25e-2 * -1;
    let pos = {x: this.v.pos.x, y: this.v.pos.y, z: this.v.pos.z};
    let scalar = map(Math.sin(pos.y * 5. - drawCount * 0.5e-1) * 0.5 + 0.5, 0., 1., 1.0, 0.95);
    pos = {x: pos.x * scalar, y: pos.y * scalar, z: pos.z * scalar};
    pos = yRotate(pos.x, pos.y, pos.z, rotateY);
    pos = xRotate(pos.x, pos.y, pos.z, rotateX);
    let d = dist(0, 0, -1.5, pos.x, pos.y, pos.z);
    // console.log(pos.x);
    // socket.emit('note', this.v.note);
    // socket.emit('note', d);
    var msg = {
        address: "/hello/from/oscjs",
        args: [
            {type: "f", value: d},
            {type: "f", value: pos.x},
        ]
    };
    socket.emit('msgToSCD', msg);
    // }
    // for (let i = 0; i < this.v.edges.length; i++) {
    //     let e = this.v.edges[i];
    //     this.v.edges[i].fire += 0.25;
    //     for (let j = 0; j < e.a.edges.length; j++) {
    //         e.a.edges[j].fire += 0.125;
    //     }
    //     for (let j = 0; j < e.b.edges.length; j++) {
    //         e.b.edges[j].fire += 0.125;
    //     }
    // }
};

Walker.prototype.sleep = function() {
    this.sleeping = true;
};

Walker.prototype.wake = function() {
    this.sleeping = false;
};

Walker.prototype.sw = function() {
    this.sleeping = !this.sleeping;
};

Walker.prototype.show = function() {
    let size;
    if (this.singing) {
        size = 8;
        this.singing = false;
    } else {
        size = 2;
    }
    if (!this.walking) {
        // if (!this.sleeping) {
            walkerVertices.push(this.v.pos.x, this.v.pos.y, this.v.pos.z, size);
        // }
    } else {
        let d = map(this.walked, 0, this.distanceToWalk, 0, 1);
        let x = lerp(this.v.pos.x, this.goalV.pos.x, d);
        let y = lerp(this.v.pos.y, this.goalV.pos.y, d);
        let z = lerp(this.v.pos.z, this.goalV.pos.z, d);
        walkerVertices.push(x, y, z, size);
        add3DLine(
            this.v.pos.x, this.v.pos.y, this.v.pos.z,
            x, y, z,
            1/6,
            1, 0, 1, 0.5
        );
        add3DLine(
            this.v.pos.x, this.v.pos.y, this.v.pos.z,
            x, y, z,
            1/45,
            1, 0, 1, 1
        );
        add3DLine(
            this.goalV.pos.x, this.goalV.pos.y, this.goalV.pos.z,
            x, y, z,
            1/6,
            1, 0, this.e.fire, 0.5
        );
        add3DLine(
            this.goalV.pos.x, this.goalV.pos.y, this.goalV.pos.z,
            x, y, z,
            1/45,
            1, 0, this.e.fire, 1
        );
    }
};