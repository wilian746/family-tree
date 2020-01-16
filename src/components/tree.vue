<template>
  <section class="component-tree">
    <tree
      v-if="!isLoading"
      :data="peopleList"
      node-text="name"
      layoutType="vertical"
      :zoomable="true"
      :duration="150"
      @clickedText="clickedText($event, 'clickedNode')"
    ></tree>
  </section>
</template>

<script>
import { tree } from 'vued3tree'

export default {
  components: {
    tree
  },
  data () {
    return {
      isLoading: false,
      nodes: [
        { name: 'Wilian', id: 1, isMe: true },
        { name: 'Rosângela', id: 2, isMe: false },
        { name: 'Carlos', id: 3, isMe: false },
        { name: 'Rosa', id: 4, isMe: false },
        { name: 'Altino', id: 5, isMe: false },
        { name: 'Maria', id: 6, isMe: false },
        { name: 'Antônio', id: 7, isMe: false },
        { name: 'Jose', id: 8, isMe: false }
      ],
      edges: [
        { from: 2, to: 1 },
        { from: 3, to: 1 },
        { from: 4, to: 2 },
        { from: 5, to: 2 },
        { from: 6, to: 3 },
        { from: 7, to: 3 }
      ],
      peopleList: {}
    }
  },
  mounted () {
    this.isLoading = true
    this.mountPeopleList()
    this.isLoading = false
  },
  methods: {
    mountPeopleList () {
      this.peopleList = {}
      const actualNode = this.nodes.find((node) => node.isMe)
      const edges = this.edges.filter((edge) => edge.to === actualNode.id)
      let childrenNodes = []
      edges.forEach((edge) => {
        const childNode = this.nodes.find((node) => edge.from === node.id)
        childrenNodes = childrenNodes.concat(childNode)
      })
      if (childrenNodes.length > 0) {
        this.insertChildrens({ ...actualNode, children: childrenNodes })
      }
    },
    insertChildrens (node) {
      node.children.forEach((parent) => {
        const edges = this.edges.filter((edge) => edge.to === parent.id)

        if (edges && edges.length) {
          edges.forEach((edge) => {
            const parentNode = this.nodes.find((node) => edge.from === node.id)
            if (parentNode) {
              if (!parent.children) {
                parent.children = []
              }
              if (!parent.children.find((child) => child.id === parentNode.id)) {
                parent.children = parent.children.concat({ ...parentNode, children: [] })
                this.insertChildrens(parent)
              }
            }
          })
        }
      })
      this.peopleList = node
    },
    clickedText (e, type) {
      this.isLoading = true
      const nodeName = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
      const nodeid = this.nodes.length + 1
      this.nodes = this.nodes.concat({ name: nodeName, id: nodeid, isMe: false })
      this.edges = this.edges.concat({ from: nodeid, to: e.data.id })
      setTimeout(() => {
        this.mountPeopleList()
        this.isLoading = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
  section.component-tree { display: block; height: 100%; width: 100%; }
</style>
