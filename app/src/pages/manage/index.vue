<template>
  <Tabs class="manage">
    <Tab :header="$t('pages.manage.tabs.editor')" active>
      <Tabs>
        <Tab :header="$t('pages.manage.tabs.myModPacks')" active>
          <table id="modPacks">
            <thead>
            <tr>
              <th>{{$t('pages.manage.modPacks.name')}}</th>
              <th>{{$t('pages.manage.modPacks.version')}}</th>
              <th>{{$t('pages.manage.modPacks.download')}}</th>
              <th>{{$t('pages.manage.modPacks.action')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="modPack in modPacks">
              <td>{{modPack.name}}</td>
              <td>{{modPack.versions.length}}</td>
              <td>??</td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </Tab>

        <Tab :header="$t('pages.manage.tabs.request')">

        </Tab>

        <Tab :header="$t('pages.manage.tabs.create')">
          <MPEditor />
        </Tab>
      </Tabs>
    </Tab>

    <Tab :header="$t('pages.manage.tabs.admin')" v-if="canAccessAdmin">ADMIN !</Tab>
  </Tabs>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss"></style>
