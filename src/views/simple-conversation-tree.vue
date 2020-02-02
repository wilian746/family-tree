<template>
  <div id="myDiagramDiv" style="border: solid 1px blue; width:100%; height: calc(100vh - 100px)"></div>
</template>

<script>
import go from 'gojs'
var goJS = go.GraphObject.make
// This works because we have overridden the /extensionsTS/tsconfig.json file
// in the options to the loader: 'ts-loader', in the webpack.config.js
export default {
  name: 'SimpleDiagram',
  mounted () {
    var diagram = new go.Diagram('myDiagramDiv')
    // the node template describes how each Node should be constructed
    diagram.nodeTemplate =
      goJS(go.Node, 'Auto', // the Shape automatically fits around the TextBlock
        goJS(go.Shape, 'RoundedRectangle', // use this kind of figure for the Shape
          // bind Shape.fill to Node.data.color
          new go.Binding('fill', 'color')),
        goJS(go.TextBlock,
          { margin: 3 }, // some room around the text
          // bind TextBlock.text to Node.data.key
          new go.Binding('text', 'key'))
      )

    diagram.model = new go.GraphLinksModel(
      [ // a JavaScript Array of JavaScript objects, one per node;
        // the 'color' property is added specifically for this app
        { key: 'Alpha', color: 'lightblue' },
        { key: 'Beta', color: 'orange' },
        { key: 'Gamma', color: 'lightgreen' },
        { key: 'Delta', color: 'pink' }
      ],
      [ // a JavaScript Array of JavaScript objects, one per link
        { from: 'Alpha', to: 'Beta' },
        { from: 'Alpha', to: 'Gamma' },
        { from: 'Beta', to: 'Beta' },
        { from: 'Gamma', to: 'Delta' },
        { from: 'Delta', to: 'Alpha' }
      ]
    )
  }
}
</script>
