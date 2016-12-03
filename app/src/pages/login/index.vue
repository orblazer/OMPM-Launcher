<template>
  <form class="login">
    <img src="/assets/img/FTN Logo.jpg" class="logo"><br>

    <img src="/assets/img/line.png">
    <section class="content">
      <div class="input-control">
        <label for="email"><img src="/assets/img/user.png"></label>
        <input type="email" id="email" :placeholder="$t('pages.login.input.email')" v-model="email"
          :class="input.emailClass">
      </div>
      <div class="input-control">
        <label for="password"><img src="/assets/img/lock.png"></label>
        <input type="password" id="password" :placeholder="$t('pages.login.input.password')" v-model="password"
          :class="input.passwordClass"
          readonly onfocus="this.removeAttribute('readonly')">
      </div>
      <div class="submit-control">
        <input type="submit" :value="$t('pages.login.input.submit') + ' >'" @click.prevent="login"
          :disabled="!input.submitEnabled">
      </div>
    </section>
    <img src="/assets/img/line.png">
  </form>

</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss"></style>
