<template>
  <section id="app">
    <section class="toolbar">
      <router-link to="/family-tree">Árvore genealógica</router-link>

      <router-link to="/simple-conversation-tree">Simples conversa</router-link>

      <router-link to="/dynamic-conversation-tree">Conversa dinâmica</router-link>
    </section>

    <router-view></router-view>
  </section>
</template>

<style lang="scss">
html {
  &, body { display: block; width: 100%; height: 100%; }

  &, body, body section#app { margin: 0; padding: 0; }

  body { overflow: auto;
    section#app { font-family: 'Avenir', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-align: center; color: #2c3e50;
      section.toolbar { display: flex; justify-content: space-around; align-items: center; width: 100%; background-color: #333;
        a { display: block; line-height: 45px; height: 45px; text-align: center; font-size: 14px; text-transform: uppercase; color: #fff; font-weight: bold; transition: all 0.3s ease; text-decoration: none; padding: 0 10px;
          &:hover { background-color: lighten(#333, 10%); }

          &.router-link-exact-active { text-decoration: underline; }
        }
      }
    }
  }
}
</style>
