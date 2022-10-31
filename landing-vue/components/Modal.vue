<template>
  <div class="modal" v-if="show" @click="hideModal">
    <div class="modal__content" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "my-modal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hideModal() {
      this.$emit("update:show", false);
    },
  },
};
</script>
  
<style scoped lang="scss">
.modal {
  top: 0;
  height: 100%;
  width: 100%;
  left: 0;
  backdrop-filter: blur(10px);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  overflow: auto;
  padding: 15px;
}

.modal__content {
  opacity: 1;
  backdrop-filter: 0;
  box-shadow: 0 10px 30px 0 rgba(30, 30, 30, 0.25);
  background-image: linear-gradient(140deg, #fff, $white 100%);
  border-radius: 12px;
}
@media (max-height: 900px) {
  .modal {
    align-items: flex-start;
  }
}
</style>