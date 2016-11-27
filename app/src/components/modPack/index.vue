<template>
  <div>
    <section class="mp-moreInfo modal" @click.self="close">
      <header class="modal-header">
        <h1>{{modPack.name}}</h1>
        <div class="action">
          <button class="btn close" @click.prevent="close"><i class="fa fa-times"></i></button>
        </div>
      </header>
      <section class="modal-content">
        <section class="mp-globalInfo">
          <div class="info">
            <h1>{{$t('components.modPack.info.title')}} :</h1>
            <ul>
              <li><strong>{{$t('components.modPack.info.name')}} :</strong> {{modPack.name}}</li>
              <li>
                <strong>{{$tc('components.modPack.info.authors', modPack.authors.length)}} :</strong>
                {{modPack.authors.join(', ')}}
              </li>
              <li v-if="modPack.version">
                <strong>{{$t('components.modPack.info.version')}} :</strong> {{modPack.version}}
              </li>
              <li><strong>{{$t('components.modPack.info.mcVersion')}} :</strong> {{modPack.mcVersion}}</li>
              <li v-if="modPack.forgeVersion">
                <strong>{{$t('components.modPack.info.forgeVersion')}} :</strong>
                {{modPack.forgeVersion}}
              </li>
            </ul>
          </div>

          <div class="action">
            <button class="makeInstance btn" @click="makeInstance(modPack.uid)">
              {{$t('components.modPack.action.makeInstance')}}
            </button>
            <button class="downloadServer btn">{{$t('components.modPack.action.downloadServer')}}</button>
          </div>
        </section>
        <Tabs class="mp-mods">
          <Tab
            :header="$tc('components.modPack.mods.tabs.core', modPack.coreMods.length) + ' (' + modPack.coreMods.length + ')'"
            active>
            <table v-if="modPack.coreMods.length > 0">
              <thead>
              <tr>
                <th>{{$t('components.modPack.mods.name')}}</th>
                <th>{{$t('components.modPack.mods.version')}}</th>
                <th>{{$t('components.modPack.mods.authors')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="coreMod in modPack.coreMods">
                <td>{{coreMod.name || $t('unknown')}}</td>
                <td>{{coreMod.version || 'x.x.x'}}</td>
                <td>{{(coreMod.authors)?coreMod.authors.join(', '):$t('unknown')}}</td>
              </tr>
              </tbody>
            </table>

            <h3 v-else>{{$t('components.modPack.mods.noCore')}}</h3>
          </Tab>

          <Tab
            :header="$tc('components.modPack.mods.tabs.mods', modPack.mods.length) + ' (' + modPack.mods.length + ')'">
            <table v-if="modPack.mods.length > 0">
              <thead>
              <tr>
                <th>{{$t('components.modPack.mods.name')}}</th>
                <th>{{$t('components.modPack.mods.version')}}</th>
                <th>{{$t('components.modPack.mods.authors')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="mod in modPack.mods">
                <td>{{mod.name || $t('unknown')}}</td>
                <td>{{mod.version || 'x.x.x'}}</td>
                <td>{{(mod.authors)?mod.authors.join(', '):$t('unknown')}}</td>
              </tr>
              </tbody>
            </table>

            <h3 v-else>{{$t('components.modPack.mods.noMods')}}</h3>
          </Tab>

          <Tab
            :header="$tc('components.modPack.mods.tabs.optional', modPack.optionalMods.length) + ' (' + modPack.optionalMods.length + ')'">
            <table v-if="modPack.optionalMods > 0">
              <thead>
              <tr>
                <th>{{$t('components.modPack.mods.name')}}</th>
                <th>{{$t('components.modPack.mods.version')}}</th>
                <th>{{$t('components.modPack.mods.authors')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="optionalMod in modPack.optionalMods">
                <td>{{optionalMod.name || $t('unknown')}}</td>
                <td>{{optionalMod.version || 'x.x.x'}}</td>
                <td>{{(optionalMod.authors)?optionalMod.authors.join(', '):$t('unknown')}}</td>
              </tr>
              </tbody>
            </table>

            <h3 v-else>{{$t('components.modPack.mods.noOptional')}}</h3>
          </Tab>
        </Tabs>
      </section>
    </section>

    <div class="mp-makeInstance" v-if="makeInstanceShow === modPack.uid" @click.self="closeInstance" key="makeInstance">
      <section class="modal">
        <header class="modal-header">
          <h1>{{$t('components.modPack.makeInstance.title')}}</h1>
          <div class="action">
            <button class="btn close" @click.prevent="closeInstance"><i class="fa fa-times"></i></button>
          </div>
        </header>
        <form class="modal-content" @submit.prevent="downloadInstance">
          <div class="input-control">
            <label for="instanceName">{{$t('components.modPack.makeInstance.name')}}</label>
            <input type="text" id="instanceName" v-model="instanceName"
              :placeholder="$t('components.modPack.makeInstance.name')">
          </div>

          <div class="input-control">
            <label for="instanceVersion">{{$t('components.modPack.makeInstance.version')}}</label>
            <select id="instanceVersion" v-model="instanceVersion">
              <option v-for="version in modPack.availableVersions" :value="version.version">
                {{version.version}}
                <span class="beta" v-if="version.versionType === 'BETA'">&nbsp;{{version.versionType}}</span>
                <span class="alpha" v-if="version.versionType === 'ALPHA'">&nbsp;{{version.versionType}}</span>
              </option>
            </select>
          </div>

          <div class="submit-control">
            <input type="submit" class="btn" :value="$t('components.modPack.makeInstance.submit')">
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
