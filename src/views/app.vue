<template>
  <div class="col-md-9 panel panel-default">
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
        <div class="btn-group-vertical">
          <button @click="addFor(data)" class="add">
            ADICIONAR
          </button>
          <button @click="remove(data, node)" class="delete">
            DELETAR
          </button>
        </div>
      </template>
    </tree>
  </div>
</template>

<script>
import { tree } from 'vued3tree'
import data from '../mock/family.json'
import { getGremlin } from './greenConfiguration.js'

let currentId = 500

const removeElement = (arr, element) => {
  const index = arr.indexOf(element)
  if (index === -1) {
    return
  }
  arr.splice(index, 1)
}

Object.assign(data, {
  type: 'tree',
  layoutType: 'horizontal',
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
    tree
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
      removeElement(parent.children, data)
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
      var horde = getGremlin(gremlinsButton, treeDiv, { changeType, changeLayout, changeNode, changeNodeTextDisplay, resetZoom })
      horde.after(() => { this.isUnderGremlinsAttack = false })
      horde.unleash()
      this.horde = horde
      this.isUnderGremlinsAttack = true
    }
  }
}
</script>
<style lang="scss">
html, {
  &, body { display: block; width: 100%; height: 100%; }

  body { overflow: auto;
    #app { font-family: 'Avenir', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-align: center; color: #2c3e50; margin-top: 20px; }

    .tree { height: 100vh; width: 100%;
      .btn-group-vertical { display: block;
        button { display: block; width: 100px; height: 25px; line-height: 25px; text-align: center; background: transparent; border: 1px solid #000; cursor: pointer;
          &.add { $color: #0a4b0a; border-color: $color; color: $color; transition: all 0.3s ease;
            &:hover{ background-color: lighten($color, 30%); color: #fff; }
          }
          &.delete { $color: #6b1111; border-color: $color; color: $color;
            &:hover{ background-color: lighten($color, 30%); color: #fff; }
          }
        }
      }
    }
  }
}
</style>
