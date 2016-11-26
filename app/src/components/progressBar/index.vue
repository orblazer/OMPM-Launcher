<template>
  <section class="progress-bar">
    <div class="text">
      <slot></slot>
    </div>
    <div class="bar" :style="'width: ' + progress + '%'"></div>
  </section>
</template>

<script>
  export default {
    name: 'ProgressBar',
    props: {
      progress: {
        type: Number,
        default: 0,
        validator (val) {
          return (val >= 0) && (val <= 100)
        }
      }
    }
  }

</script>
<style src="./index.scss" lang="scss" scoped></style>
