<template>
  <section class="modPacks">
    <ul v-if="modPacks.length > 0">
      <li v-for="modPack in modPacks" :id="modPack.uid" :key="modPack.uid" class="modPack">
        <img :src="modPack.logo" :alt="modPack.title" class="mp-img">

        <section class="mp-info">
          <h1 class="title" @click.prevent="view(modPack.uid)">
            {{modPack.name}}
            (V: {{modPack.version}})
            <span v-if="modPack.versionType === 'BETA'" class="beta">&nbsp;(BETA)</span>
            <span v-if="modPack.versionType === 'ALPHA'" class="alpha">&nbsp;(ALPHA)</span>
          </h1>
          <p>{{modPack.smallDesc}}</p>
          <footer>
            {{$t('pages.modPacks.by')}} {{modPack.authors.join(', ')}},
            {{$t('pages.modPacks.created')}} {{formatDate(modPack.created)}}
            <span v-if="modPack.updated">, {{$t('pages.modPacks.updated')}} {{formatDate(modPack.updated)}}</span>
          </footer>
        </section>

        <transition name="fade">
          <ModPack v-if="moreInfoShow === modPack.uid" key="moreInfo" :modPackUid="modPack.uid" />
        </transition>
      </li>
    </ul>
    <h2 v-else>Aucun packs de mods n'est disponible</h2>
  </section>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
