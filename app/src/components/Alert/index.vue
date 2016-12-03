<template>
  <transition-group tag="ul" name="slide" appear class="alerts">
    <li v-for="alert in alerts" :class="'alert ' + alert.type" :key="alert.id" :id="alert.id">
      <p class="alert-message" v-html="alert.message"></p>
      <button class="alert-close">✖</button>
    </li>
  </transition-group>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
