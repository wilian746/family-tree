<template>

<div id="sample">
  <div id="myDiagramDiv" style="background-color: #34343C; border: solid 1px black; height: 570px;"></div>
  <p><button id="zoomToFit">Zoom to Fit</button> <button id="centerRoot">Center on root</button></p>

  <div>
    <div id="myInspector">
    </div>
  </div>
  <p>
    This editable organizational chart sample color-codes the Nodes according to the tree level in the hierarchy.
  </p>
  <p>
    Double click on a node in order to add a person or the diagram background to add a new boss. Double clicking the diagram uses the <a>ClickCreatingTool</a>
    with a custom <a>ClickCreatingTool.insertPart</a> to scroll to the new node and start editing the <a>TextBlock</a> for its name .
  </p>
  <p>
    Drag a node onto another in order to change relationships.
    You can also draw a link from a node's background to other nodes that have no "boss". Links can also be relinked to change relationships.
    Right-click or tap-hold a Node to bring up a context menu which allows you to:
    </p><ul>
      <li>Vacate Position - remove the information specfic to the current person in that role</li>
      <li>Remove Role - removes the role entirely and reparents any children</li>
      <li>Remove Department - removes the role and the whole subtree</li>
    </ul>
    Deleting a Node or Link will orphan the child Nodes and generate a new tree. A custom SelectionDeleting <a>DiagramEvent</a> listener will clear out the boss info
    when the parent is removed.
  <p></p>
  <p>
    Select a node to edit/update node data values. This sample uses the Data Inspector extension to display and modify Part data.
  </p>
  <p>
    To learn how to build an org chart from scratch with GoJS, see the Getting Started tutorial.
  </p>
  <p>
    If you want to have some "assistant" nodes on the side, above the regular reports,
    see the Org Chart Assistants sample, which is a copy of this sample
    that uses a custom <a>TreeLayout</a> to position "assistants" that way.
  </p>
  <div>
    <div>
      <button id="SaveButton" @click="save()">Save</button>
      <button @click="load()">Load</button>
      Diagram Model saved in JSON format:
    </div>
    <textarea id="mySavedModel" style="width:100%; height:270px;">{ "class": "go.TreeModel",
  "nodeDataArray": [
{"key":1, "name":"Stella Payne Diaz", "title":"CEO"},
{"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales", "parent":1},
{"key":3, "name":"Meg Meehan Hoffa", "title":"Sales", "parent":2},
{"key":4, "name":"Peggy Flaming", "title":"VP Engineering", "parent":1},
{"key":5, "name":"Saul Wellingood", "title":"Manufacturing", "parent":4},
{"key":6, "name":"Al Ligori", "title":"Marketing", "parent":2},
{"key":7, "name":"Dot Stubadd", "title":"Sales Rep", "parent":3},
{"key":8, "name":"Les Ismore", "title":"Project Mgr", "parent":5},
{"key":9, "name":"April Lynn Parris", "title":"Events Mgr", "parent":6},
{"key":10, "name":"Xavier Breath", "title":"Engineering", "parent":4},
{"key":11, "name":"Anita Hammer", "title":"Process", "parent":5},
{"key":12, "name":"Billy Aiken", "title":"Software", "parent":10},
{"key":13, "name":"Stan Wellback", "title":"Testing", "parent":10},
{"key":14, "name":"Marge Innovera", "title":"Hardware", "parent":10},
{"key":15, "name":"Evan Elpus", "title":"Quality", "parent":5},
{"key":16, "name":"Lotta B. Essen", "title":"Sales Rep", "parent":3}
 ]
}
    </textarea>
  </div>
</div>
</template>

<script>
/* eslint-disable */
import go from 'gojs'
var goJS = go.GraphObject.make

export default {
  data() {
    return {
      myDiagram: {}
    }
  },
  mounted() {
    this.myDiagram =
        goJS(go.Diagram, 'myDiagramDiv', // must be the ID or reference to div
          {
            maxSelectionCount: 1, // users can select only one part at a time
            validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
            "clickCreatingTool.archetypeNodeData": { // allow double-click in background to create a new node
              name: "(new person)",
              title: "",
              comments: ""
            },
            "clickCreatingTool.insertPart": function(loc) {  // scroll to the new node
              var node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
              if (node !== null) {
                this.diagram.select(node);
                this.diagram.commandHandler.scrollToPart(node);
                this.diagram.commandHandler.editTextBlock(node.findObject("NAMETB"));
              }
              return node;
            },
            layout:
              goJS(go.TreeLayout,
                {
                  treeStyle: go.TreeLayout.StyleLastParents,
                  arrangement: go.TreeLayout.ArrangementHorizontal,
                  // properties for most of the tree:
                  angle: 90,
                  layerSpacing: 35,
                  // properties for the "last parents":
                  alternateAngle: 90,
                  alternateLayerSpacing: 35,
                  alternateAlignment: go.TreeLayout.AlignmentBus,
                  alternateNodeSpacing: 20
                }),
            "undoManager.isEnabled": true // enable undo & redo
          });

      // when the document is modified, add a "*" to the title and enable the "Save" button
      this.myDiagram.addDiagramListener("Modified", function(e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !this.myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (this.myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      // // manage boss info manually when a node or link is deleted from the diagram
      // this.myDiagram.addDiagramListener("SelectionDeleting", function(e) {
      //   var part = e.subject.first(); // e.subject is the this.myDiagram.selection collection,
      //   // so we'll get the first since we know we only have one selection
      //   this.myDiagram.startTransaction("clear boss");
      //   if (part instanceof go.Node) {
      //     var it = part.findTreeChildrenNodes(); // find all child nodes
      //     while (it.next()) { // now iterate through them and clear out the boss information
      //       var child = it.value;
      //       var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
      //       if (bossText === null) return;
      //       bossText.text = "";
      //     }
      //   } else if (part instanceof go.Link) {
      //     var child = part.toNode;
      //     var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
      //     if (bossText === null) return;
      //     bossText.text = "";
      //   }
      //   this.myDiagram.commitTransaction("clear boss");
      // });


      // var levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
      //   "#008299", "#D24726", "#008A00", "#094AB2"];

      // // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
      // this.myDiagram.layout.commitNodes = function() {
      //   go.TreeLayout.prototype.commitNodes.call(this.myDiagram.layout);  // do the standard behavior
      //   // then go through all of the vertexes and set their corresponding node's Shape.fill
      //   // to a brush dependent on the TreeVertex.level value
      //   this.myDiagram.layout.network.vertexes.each(function(v) {
      //     if (v.node) {
      //       var level = v.level % (levelColors.length);
      //       var color = levelColors[level];
      //       var shape = v.node.findObject("SHAPE");
      //       if (shape) shape.stroke = goJS(go.Brush, "Linear", { 0: color, 1: go.Brush.lightenBy(color, 0.05), start: go.Spot.Left, end: go.Spot.Right });
      //     }
      //   });
      // };

      // // when a node is double-clicked, add a child to it
      // function nodeDoubleClick(e, obj) {
      //   var clicked = obj.part;
      //   if (clicked !== null) {
      //     var thisemp = clicked.data;
      //     this.myDiagram.startTransaction("add employee");
      //     var newemp = {
      //       name: "(new person)",
      //       title: "",
      //       comments: "",
      //       parent: thisemp.key
      //     };
      //     this.myDiagram.model.addNodeData(newemp);
      //     this.myDiagram.commitTransaction("add employee");
      //   }
      // }
  },
  methods: {
    // Show the diagram's model in JSON format
    save() {
      document.getElementById("mySavedModel").value = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
    },
    load() {
      this.myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
      // make sure new data keys are unique positive integers
      var lastkey = 1;
      this.myDiagram.model.makeUniqueKeyFunction = function(model, data) {
        var k = data.key || lastkey;
        while (model.findNodeDataForKey(k)) k++;
        data.key = lastkey = k;
        return k;
      };
    }
  }
}

</script>
