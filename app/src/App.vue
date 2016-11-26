<template>
  <section id="app">
    <header>
      <h1>OMPM Launcher</h1>
      <div class="action">
        <button class="btn hide" @click.prevent="window_hide"><i class="fa fa-minus"></i></button>
        <button class="btn close" @click.prevent="window_close"><i class="fa fa-times"></i></button>
      </div>
    </header>

    <template v-if="!$route.meta.customRender">
      <transition name="fade-2">
        <section class="container">
          <Navigation></Navigation>

          <section class="content">
            <template v-if="$route.matched.length">
              <router-view></router-view>
            </template>
          </section>
        </section>
      </transition>
    </template>

    <template v-if="$route.meta.customRender">
      <template v-if="$route.matched.length">
        <router-view></router-view>
      </template>
    </template>

    <Alert></Alert>
    <footer>Copyright © 2016 Relonar</footer>
  </section>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'App',
    components: {
      Navigation: require('./components/Navigation/index.vue'),
      Alert: require('./components/Alert/index.vue')
    },
    mounted () {
      $('#app').on('click', 'a[target="_blank"]', function () {
        require('electron').shell.openExternal($(this).attr('href'))
      })
    }
  }
</script>

<style src="./assets/style/global.scss" lang="scss"></style>
<style src="./assets/style/font-awesome.min.css"></style>
