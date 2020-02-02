<template>
  <section class="container-app">
    <tree ref="tree"
      v-model="currentData"
      :nodeTextDisplay="nodeTextDisplay"
      :identifier="getId"
      :nodeTextMargin="nodeTextMargin"
      :zoomable="zoomable"
      :data="Graph.tree"
      :leafTextMargin="leafTextMargin"
      :node-text="nodeText"
      :margin-x="Marginx"
      :margin-y="Marginy"
      :radius="radius"
      :type="type"
      :layout-type="layoutType"
      :linkLayout="linkLayout"
      :duration="duration"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      contextMenuPlacement="bottom-start"
      class="tree"
      @clickedText="onClick"
      @expand="onExpand"
      @retract="onRetract"
      @clickedNode="onClickNode">

      <template #popUp="{data,node}">
        <add-remove-component
          @add="addFor(data)"
          @remove="remove(data, node)"
        />
        <!-- <div class="btn-group-vertical">
          <button @click="addFor(data)" class="add">
            <img src="../assets/add.svg">
          </button>
          <button @click="remove(data, node)" class="delete">
            <img src="../assets/remove.svg">
          </button>
        </div> -->
      </template>
    </tree>
  </section>
</template>

<script>
import addRemoveComponent from '../components/add-remove.vue'
import { tree } from 'vued3tree'
import data from '../mock/family.json'
import gremlins from 'gremlins.js/src/main'

let currentId = 500

Object.assign(data, {
  type: 'tree',
  layoutType: 'vertical',
  duration: 750,
  Marginx: 30,
  Marginy: 30,
  radius: 3,
  leafTextMargin: 6,
  nodeTextMargin: 6,
  nodeText: 'text',
  currentData: null,
  zoomable: true,
  isLoading: false,
  isUnderGremlinsAttack: false,
  nodeTextDisplay: 'all',
  linkLayout: 'bezier',
  minZoom: 0.8,
  maxZoom: 9,
  events: []
})

export default {
  name: 'app',
  data () {
    return data
  },
  components: {
    tree,
    addRemoveComponent
  },
  methods: {
    async do (action) {
      if (this.currentData) {
        this.isLoading = true
        await this.$refs['tree'][action](this.currentData)
        this.isLoading = false
      }
    },
    getId (node) {
      return node.id
    },
    expandAll () {
      this.do('expandAll')
    },
    collapseAll () {
      this.do('collapseAll')
    },
    showOnly () {
      this.do('showOnly')
    },
    show () {
      this.do('show')
    },
    onClick (evt) {
      this.onEvent('clickedText', evt)
    },
    onClickNode (evt) {
      this.onEvent('clickedNode', evt)
    },
    onExpand (evt) {
      this.onEvent('onExpand', evt)
    },
    onRetract (evt) {
      this.onEvent('onRetract', evt)
    },
    onEvent (eventName, data) {
      this.events.push({ eventName, data: data.data })
    },
    addFor (data) {
      const newData = {
        id: currentId++,
        children: [],
        text: Math.random().toString(36).substring(7)
      }
      data.children.push(newData)
    },
    remove (data, node) {
      const parent = node.parent.data
      this.removeElement(parent.children, data)
    },
    removeElement (arr, element) {
      const index = arr.indexOf(element)
      if (index === -1) {
        return
      }
      arr.splice(index, 1)
    },
    resetZoom () {
      if (!this.$refs['tree']) {
        return
      }
      this.isLoading = true
      this.$refs['tree'].resetZoom().then(() => { this.isLoading = false })
    },
    gremlins () {
      if (this.isUnderGremlinsAttack) {
        this.horde.stop()
        return
      }
      const updateType = (type) => {
        switch (type) {
          case 'vertical':
            return 'circular'
          case 'circular':
            return 'horizontal'
          case 'horizontal':
            return 'vertical'
        }
      }
      const updateNodeTextDisplay = (display) => {
        switch (display) {
          case 'all':
            return 'leaves'
          case 'leaves':
            return 'extremities'
          case 'extremities':
            return 'all'
        }
      }
      this.duration = 20
      const changeLayout = () => { this.type = (this.type === 'tree') ? 'cluster' : 'tree' }
      const changeNode = () => { this.linkLayout = (this.linkLayout === 'bezier') ? 'orthogonal' : 'bezier' }
      const changeType = () => { this.layoutType = updateType(this.layoutType) }
      const changeNodeTextDisplay = () => { this.nodeTextDisplay = updateNodeTextDisplay(this.nodeTextDisplay) }
      const resetZoom = this.resetZoom.bind(this)
      const [treeDiv] = this.$el.getElementsByClassName('tree')
      const [gremlinsButton] = this.$el.getElementsByClassName('btn-danger')
      var horde = this.getGremlin(gremlinsButton, treeDiv, { changeType, changeLayout, changeNode, changeNodeTextDisplay, resetZoom })
      horde.after(() => { this.isUnderGremlinsAttack = false })
      horde.unleash()
      this.horde = horde
      this.isUnderGremlinsAttack = true
    },
    getGremlin (prohibited, element, { changeType, changeLayout, changeNodeTextDisplay, changeNode, resetZoom }) {
      const horde = gremlins.createHorde()
        .gremlin(gremlins.species.clicker().canClick((element) => {
          if (prohibited === element) {
            return false
          }
          switch (element.tagName) {
            case 'circle':
            case 'BUTTON':
            case 'text':
              return true

            case 'INPUT':
              return element.type === 'checkbox'
          }
          return false
        }).maxNbTries(15))
        .gremlin(function () {
          console.log('gremlin changeType')
          changeType()
        })
        .gremlin(function () {
          console.log('gremlin changeLayout')
          changeLayout()
        })
        .gremlin(function () {
          console.log('gremlin changeNode')
          changeNode()
        })
        .gremlin(function () {
          console.log('gremlin changeNodeTextDisplay')
          changeNodeTextDisplay()
        })
        .gremlin(function () {
          console.log('gremlin resetZoom')
          resetZoom()
        })
        .gremlin(function () {
          console.log('gremlin click circle')
          const circles = [...element.getElementsByClassName('node--internal')]
          if (circles.length === 0) {
            return
          }
          const idx = Math.round(Math.random() * (circles.length - 1))
          const circle = circles[idx]
          const evt = document.createEvent('MouseEvents')
          evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          circle.dispatchEvent(evt)
        })
        .strategy(gremlins.strategies.distribution()
          .delay(100)
          .distribution([
            0.8,
            0.04,
            0.04,
            0.04,
            0.08
          ])
        )

      return horde
    }
  }
}
</script>

<style lang="scss">
div.tree { height: 100vh; width: 100%;
  div.pop-up-tree { transition: all 0.3s ease; }

  // div.btn-group-vertical { display: block;
  //   button { display: flex; justify-content: center; align-items: center; width: 35px; height: 35px; background: transparent; border: none; cursor: pointer; border-radius: 55%; transition: all 0.3s ease;
  //     &:hover { background-color: #cdcdcd; }

  //     img { display: block; width: 70%; }
  //   }
  // }
}
</style>
