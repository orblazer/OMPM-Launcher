<template>
  <section class="console">
    <Tabs class="content">
      <Tab header="Launcher" active v-html="launcherLog" id="launcherLog">
      </Tab>
      <Tab header="Minecraft">MINECRAFT !!!</Tab>
    </Tabs>

    <footer>
      <button class="btn">{{$t('console.send')}}</button>
      <div class="selectAutoScroll">
        {{$t('console.autoScroll')}}
        <div class="autoScroll">
          <input type="checkbox" id="autoScroll" v-model="autoScroll" />
          <label for="autoScroll"></label>
        </div>
      </div>
    </footer>
  </section>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
