<template>
  <section class="tabs">
    <ul class="tabs-control">
      <li :class="{active: (isActive === tab.message)}" @click="open(tab)" v-for="tab in tabs">
        {{tab.message}}
      </li>
    </ul>

    <div class="tabs-content">
      <slot></slot>
    </div>
  </section>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
