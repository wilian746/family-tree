<template>
  <div class="btn-group-vertical">
    <button @click="$emit('add')" class="add">
      <img src="../assets/add.svg">
    </button>
    <button @click="$emit('remove')" class="delete">
      <img src="../assets/remove.svg">
    </button>
</div>
</template>

<style lang="scss">
div.btn-group-vertical { display: block;
  button { display: flex; justify-content: center; align-items: center; width: 35px; height: 35px; background: transparent; border: none; cursor: pointer; border-radius: 55%; transition: all 0.3s ease;
    &:hover { background-color: #cdcdcd; }

    img { display: block; width: 70%; }
  }
}
</style>
