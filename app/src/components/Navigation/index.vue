<template>
  <nav class="navBar" role="navigation">
    <router-link to="/modPacks" v-if="serverAvailable">
      <i class="fa fa-server"></i> {{$t("navigation.modPacks")}}
    </router-link>
    <router-link to="/instances"><i class="fa fa-server"></i> {{$t("navigation.instances")}}</router-link>
    <router-link to="/manage" v-if="canManage">
      <i class="fa fa-database"></i>
      <template v-if="canAdmin">{{$t("navigation.manage")}}</template>
      <template v-else>{{$t("navigation.editor")}}</template>
    </router-link>
    <router-link to="/console"><i class="fa fa-terminal"></i> {{$t("navigation.console")}}</router-link>
    <router-link to="/settings"><i class="fa fa-gear"></i> {{$t("navigation.settings")}}</router-link>
    <router-link to="/logout" v-if="loggedIn"><i class="fa fa-sign-out"></i> {{$t("navigation.logout")}}</router-link>
  </nav>
</template>
<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
