//Global variables

function render_cells(cells){
	for (var i = 0; i < cells.length; i++){
		cells[i].render();
	}
}

function update_cells(cells){
	for (var i = 0; i < cells.length; i++){
		cells[i].update_states();
	}
}


function gen_uid(){
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


function rand_neg(){
	if (Math.random() > .5){
		return 1.0;
	}
	else{
		return -1.0;
	}
}

class GlobalStateContainer{
	constructor(context, canvas, grid_width, cells, sp_hash, max_cells, color, max_size){
		this.context = context;
		this.screen_width = canvas.width;
		this.canvas = canvas;
		this.grid_width = grid_width;
		this.cells = cells;
		this.sp_hash = sp_hash;
		this.max_cells = max_cells;
		this.color = color;
		this.max_size = max_size;
	}
	init(){
		//add in a cell
		 var direction = 3*Math.PI/2.0;
		 var branching_chance = .99;
		 this.cells.push(new Cell(state, this.max_size, this.canvas.width/2, this.canvas.height, direction, cells, branching_chance));
	}
}

class Leaf{
	constructor(state, size, x, y){
		this.size = size;
		this.context = state.context;
		this.x = x;
		this.y = y;
		//this.draw();
	}
	draw(){
		//nucleus
	   	this.context.fillStyle = "green";
		this.context.beginPath();
		this.context.globalAlpha = .1;
		this.context.arc(this.x + this.size/2, this.y + this.size/2, this.size, 0,2*Math.PI);
		this.context.fill();
	   	this.context.closePath();
	}
}

class Cell{
	constructor(state, size, x, y, direction, cells, branching_chance, branch_age){
		this.uid = gen_uid();
		this.size = size; //size is radius btw
		this.age = 0;
		this.cells = cells; //array of all the things in the world to update positions.
		this.state = state; //encapsulation over global state
		this.context = state.context;
		this.cells = state.cells;
		//growth direction
		this.direction = direction;
		//age state
		this.age = 0;
		//positional state
		this.x = x; //should refer to center
		this.y = y;
		this.branching_chance = branching_chance;
		//messaging state
		this.messaging = false;
		this.branch_age = branch_age;

	}
	update_states(){
		//update size
		//randomly divide
		this.divide();
		this.die();
		this.bloom();
	}
	bloom(){
		if (this.size < 30.0 && Math.random() > .99){
			new Leaf(this.state, 40.0, this.x, this.y);
		}
	}
	die(){
		if (this.size < 5.0){
			var index = this.cells.indexOf(this);
			if (index > -1) {
			  this.cells.splice(index, 1);
			}
			delete this;
		}

	}
	render(){
		//Draw the white line that covers
	   	this.context.strokeStyle = "#ffffff"
		this.context.beginPath();
		this.context.globalAlpha = .1;
		this.context.lineWidth = this.size/20.0;
		var half_width = this.size/2;
		var x = this.x - half_width;
		var y = this.y - half_width;
		this.context.moveTo(x, y);
		//render perpendicular to direction
		var dir = this.direction +  Math.PI/2.0
		this.context.lineTo(Math.cos(dir)*this.size + x, Math.sin(dir) * this.size + y);
		this.context.stroke();
	   	this.context.closePath();
	   	//now draw the end dots
	   	this.context.fillStyle = "black";
		this.context.beginPath();
		this.context.globalAlpha = .1;
		this.context.arc(x, y, this.size/20.0, 0,2*Math.PI);
		this.context.fill();
	   	this.context.closePath();
	   	//3
	   	this.context.fillStyle = "black";
		this.context.beginPath();
		this.context.globalAlpha = .1;
		this.context.arc(Math.cos(dir)*this.size/9.0 + x, Math.sin(dir) * this.size/2.0 + y, this.size/40.0, 0,2*Math.PI);
		this.context.fill();
	   	this.context.closePath();
	   	//3
	   	this.context.fillStyle = "black";
		this.context.beginPath();
		this.context.globalAlpha = .1;
		this.context.arc(Math.cos(dir)*this.size/10.0 + x, Math.sin(dir) * this.size/2.0 + y, this.size/40.0, 0,2*Math.PI);
		this.context.fill();
	   	this.context.closePath();
	   	//3
	   	this.context.fillStyle = "black";
		this.context.beginPath();
		this.context.globalAlpha = .1;
		this.context.arc(Math.cos(dir)*this.size/3.0 + x, Math.sin(dir) * this.size/2.0 + y, this.size/30.0, 0,2*Math.PI);
		this.context.fill();
	   	this.context.closePath();
	   	//edot 3
	   	//edot 2
	   	this.context.fillStyle = "black";
		this.context.beginPath();
		this.context.globalAlpha = .1;
		this.context.arc(Math.cos(dir)*this.size + x, Math.sin(dir) * this.size + y, this.size/40.0, 0,2*Math.PI);
		this.context.fill();
	   	this.context.closePath();
	}
	divide(){
		this.age += 1;
		this.direction_chance = .99;
		this.branching_dev = Math.PI/4;
		this.branching_push = Math.PI/5;
		//branching logic
		var noise_x = rand_neg() * this.size;
		var noise_y = rand_neg() * this.size; //only positive	
		var rand_x = Math.round(Math.cos(this.direction)) * this.size + noise_x;
		var rand_y = Math.round(Math.sin(this.direction)) * this.size + noise_y;
		rand_x = rand_x/30.0;
		rand_y = rand_y/30.0;
		if (Math.random() > this.branching_chance && this.state.cells.length < 200 && this.age >= 100){
			var new_left = this.direction - this.branching_dev;
			var new_right = this.direction + this.branching_dev;
			new_left = this.cap(new_left);
			new_right = this.cap(new_right);
			var new_size = this.size * .8;
			this.cells.push(new Cell(this.state, new_size, this.x, this.y, new_right, this.cells, this.branching_chance-.01));
			this.direction = new_left;
			this.size = new_size;
		}
		else{
			this.size *= .999; //reduce in size as grows
			this.x += rand_x;
			this.y += rand_y;
			//divide in the given direction, don't branch
			//move
			return;
		}
	}
	cap(dir){ //the Javascript canvas is upside down
		if (dir < Math.PI){
			return Math.PI;
		}
		else if (dir > 2*Math.PI){
			return 2*Math.PI;
		}
		else{
			return dir;
		}
	}
}
