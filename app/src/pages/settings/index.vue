<template>
  <form class="settings" @submit.prevent="saveSettings">
    <Tabs>
      <Tab :header="$t('pages.settings.tabs.global')" active>
        <div class="input-control folderSelection">
          <label for="gameLocation">{{$t('pages.settings.gameLocation')}}</label>
          <input type="file" class="folderInput" id="gameLocation" ref="gameLocation" nwdirectory
            @change="gameLocChange">
          <label for="gameLocation" class="folderSelectInput">{{general.installPath}}</label>
        </div>

        <div class="input-control">
          <label for="launcherVisibility">{{$t('pages.settings.launcherVisibility.label')}}</label>
          <select id="launcherVisibility" v-model="general.launcherVisibility">
            <option value="always">{{$t('pages.settings.launcherVisibility.always')}}</option>
            <option value="hidden">{{$t('pages.settings.launcherVisibility.hidden')}}</option>
            <option value="close">{{$t('pages.settings.launcherVisibility.close')}}</option>
          </select>
        </div>
      </Tab>

      <Tab :header="$t('pages.settings.tabs.java')">
        <div class="input-control folderSelection">
          <label for="javaLocation">{{$t('pages.settings.javaLocation')}}</label>
          <input type="file" accept="java.*" class="folderInput" id="javaLocation" ref="javaLocation" @change="javaLocChange" :value="java.installPath">
          <label for="javaLocation" class="folderSelectInput">{{java.installPath}}</label>
        </div>

        <div class="input-control">
          <label for="javaRam">{{$t('pages.settings.allocatedRam')}}</label>
          <select id="javaRam" v-model="java.allocatedRam">
            <option value="512">512 Mo</option>
            <option v-for="ram in possibleRam" :value="ram * 1024">{{ram}} Go</option>
          </select>
        </div>
      </Tab>
    </Tabs>

    <div class="submit-control">
      <input type="submit" class="btn" :value="$t('pages.settings.submit')">
    </div>
  </form>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss"></style>
