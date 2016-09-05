

function Visualizer(nodes, canvas){
   this.numNodes = nodes;
   this.canvas = canvas;
   this.context = canvas.getContext('2d');
   this.speed = .2;

   this.init();
}

Visualizer.prototype = {
   init: function(){
      this.nodes = new Array(0);// array of nodes
      this.createNodes();
      this.createConnections();
      this.render();
   },
   clear: function(){
      this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
   },
   createNodes: function(){
      var height = canvas.height;
      var width = canvas.width;


      var max = 10;
      var starty = 0;

      var nodeRadius = canvas.width/(max*5); //node radius
      var startx = nodeRadius * 2 ; //variables for radius drawing
      var currentNode = 0; // current Node for
      var paintWidth = nodeRadius * 4; //used for grid spacing of nodes


      for (var i = 0; i< this.numNodes; i++){
         var x = startx + paintWidth + Math.random() * 400;
         var y = starty + paintWidth + Math.random() * 100;
         var node = new Node(this.context, nodeRadius, x,y, this.speed);
         this.nodes.push(node);
      }

   },
   checkCollisions: function(canvas, node){
      var dx = node.dx;
      var dy = node.dy;
      var x = node.x;
      var y = node.y;
      if(x + dx > canvas.width-node.radius || x + dx < node.radius) {
          node.dx = -dx;
      }

      if(y + dy > canvas.height-node.radius || y + dy < node.radius) {
          node.dy = -dy;
      }
   },
   update: function(){
      for (var i = 0; i< this.nodes.length; i++){
         this.checkCollisions(this.canvas, this.nodes[i]);
         this.nodes[i].update();

      }
   },
   createConnections: function(){
      for (var i = 0; i< this.numNodes; i++){ //exclude last layer
         for (var j = 0; j < this.numNodes; j++){
            //iterates through, sees if it can make outgoing connects
            if (i == j) continue;
            this.nodes[i].createConnection(this.nodes[j]);
         }
      }
   },
   render: function(){
      var nodes = this.nodes;
      this.clear();
      for (var i = 0; i< nodes.length; i++){
         this.nodes[i].renderConnections();
      }
      for (var i = 0; i< nodes.length; i++){
         this.nodes[i].render();
      }
   },

}

function Node(context, radius, x,y, currSpeed){
   this.context = context;
   this.outputs = new Array(0); //array of nodeConnections
   this.x = x;
   this.y = y;
   this.radius = radius;
   this.connections = new Array(0);
   this.color = "white";
   this.currSpeed = currSpeed;
   this.lastSpeed = currSpeed; //use for a time slow down function
   this.textOpacity = 0; //use for fade in animation
   this.text = "";
   this.toFollow = null; //function to call when follow target is called

   this.dx = this.currSpeed * (Math.random() > .5 ? Math.random(): Math.random());
   this.dy = this.currSpeed * (Math.random() > .5 ? Math.random(): Math.random());
}

Node.prototype = {
   render: function(){
      this.context.beginPath();
      //Fill below with white
      this.context.fillStyle = "white";
      this.context.globalAlpha = .9;
      this.context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
      this.context.fill();
      //Begin actual redner code
      this.context.fillStyle = this.color;
      this.context.globalAlpha = .8;
      this.context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
      this.context.fill();
      this.context.closePath();

      if (this.textOpacity > 0){
         this.context.globalAlpha = this.textOpacity;
         this.context.font = 'bold 13px Arial';
         this.context.fillStyle = 'black';
         this.context.fillText(this.text, this.x - (this.text.length * 3.2), this.y);
      }
   },
   followTarget: function(){
      console.log(this.toFollow);
      if (this.toFollow){
         console.log("followed linke");
         this.toFollow();
      }
   },
   createConnection: function(node2){
         var connect = new NodeConnection(this, node2, this.context);
         this.connections.push(connect);
   },
   renderConnections: function(){
      for (var i = 0; i < this.connections.length; i++){
         this.connections[i].render();
      }
   },
   update: function(){
      this.x += this.dx;
      this.y += this.dy;
      for (var i = 0; i < this.connections.length; i++){
         this.connections[i].update()
      }
   }
}

function NodeConnection(node1, node2, context){
   this.context = context;
   this.node1 = node1;
   this.node2 = node2;
   this.x1 = node1.x;
   this.y1 = node1.y;
   this.x2 = node2.x;
   this.y2 = node2.y;
}

NodeConnection.prototype = {
   render: function(){
      this.context.beginPath();
      this.context.strokeStyle = 'white';
      this.context.globalAlpha = .5;
      this.context.lineTo(this.x1, this.y1);
      this.context.lineTo(this.x2,this.y2);
      this.context.stroke();
      this.context.closePath();
   },
   update: function(){
      this.x1 = this.node1.x;
      this.y1 = this.node1.y;
      this.x2 = this.node2.x;
      this.y2 = this.node2.y;
   }
}
