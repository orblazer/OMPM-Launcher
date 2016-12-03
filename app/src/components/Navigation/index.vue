<template>
  <nav class="navBar" role="navigation">
    <router-link to="/modPacks" v-if="serverAvailable">
      <i class="fa fa-server"></i> {{$t('components.navigation.modPacks')}}
    </router-link>
    <router-link to="/instances"><i class="fa fa-server"></i> {{$t('components.navigation.instances')}}</router-link>
    <router-link to="/manage" v-if="canManage">
      <i class="fa fa-database"></i>
      {{$tc('components.navigation.manage', canAdmin?1:2)}}
    </router-link>
    <router-link to="/console">
      <i class="fa fa-terminal"></i> {{$t('components.navigation.console')}}</router-link>
    <router-link to="/settings"><i class="fa fa-gear"></i> {{$t('components.navigation.settings')}}</router-link>
    <router-link to="/login" v-if="loggedIn">
      <i class="fa fa-sign-out"></i> {{$t('components.navigation.logout')}}
    </router-link>
  </nav>
</template>
<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
