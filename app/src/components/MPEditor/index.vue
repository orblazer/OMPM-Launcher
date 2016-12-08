<template>
  <form class="editor">
    <ul class="steps-control">
      <li :class="(step >= 0) ? 'active' : ''">
        <span class="step">1</span>
        <span class="title">{{$t('components.mpEditor.steps[0].step_name')}}</span>
      </li>
      <li :class="(step >= 2) ? 'active' : ''">
        <span class="step">2</span>
        <span class="title">{{$t('components.mpEditor.steps[1].step_name')}}</span>
      </li>
      <li :class="(step >= 3) ? 'active' : ''">
        <span class="step">3</span>
        <span class="title">{{$t('components.mpEditor.steps[2].step_name')}}</span>
      </li>
      <li :class="(step >= 4) ? 'active' : ''">
        <span class="step">4</span>
        <span class="title">{{$t('components.mpEditor.steps[3].step_name')}}</span>
      </li>
    </ul>

    <ul class="steps-content">
      <li class="step-1" v-show="(step === 0) || (step === 1)">
        <template v-if="step === 0">
          <div class="input-control folderSelection">
            <label for="mpLocation">{{$t('components.mpEditor.steps[0].zipLocation')}}</label>
            <input type="text" v-model="mpLocation" id="mpLocation" class="folderSelectInput"
              @click.prevent="selectMpFile">
          </div>
        </template>

        <template v-if="step === 1">
          <div class="input-control">
            <label for="mpName">{{$t('components.mpEditor.steps[0].name')}}</label>
            <input type="text" id="mpName" :placeholder="$t('components.mpEditor.steps[0].name')" v-model="modPack.name"
              minlength="5" maxlength="45" required>
          </div>

          <div class="input-control">
            <label for="mpSmallDesc" v-html="$t('components.mpEditor.steps[0].smallDesc')"></label>
            <textarea id="mpSmallDesc" v-model="modPack.smallDesc" rows="4" minlength="50" maxlength="350"
              required></textarea>
          </div>

          <div class="input-control">
            <label for="mpVersion">{{$t('components.mpEditor.steps[0].version')}}</label>
            <input type="text" id="mpVersion" :placeholder="$t('components.mpEditor.steps[0].version')"
              v-model="modPack.version" minlength="3" maxlength="12" required>
          </div>

          <div class="input-control">
            <label for="mpAuthors" v-html="$t('components.mpEditor.steps[0].authors_label')"></label>
            <input type="text" id="mpAuthors" :placeholder="$t('components.mpEditor.steps[0].authors')"
              v-model="modPack.authors" minlength="3" maxlength="255" required>
          </div>

          <div class="input-control">
            <label for="mpMcVersion">{{$t('components.mpEditor.steps[0].mcVersion')}}</label>
            <select id="mpMcVersion" v-model="modPack.mcVersion" required>
              <option v-for="mcVersion in mcVersions" :value="mcVersion.version">{{mcVersion.version}}</option>
            </select>
          </div>

          <div class="input-control">
            <label for="mpForgeVersion">{{$t('components.mpEditor.steps[0].forgeVersion')}}</label>
            <select id="mpForgeVersion" v-model="modPack.forgeVersion" required>
              <option v-for="forgeVersion in forgeVersions" :value="forgeVersion.forgeVersion">
                {{forgeVersion.forgeVersion}}
                <template v-if="forgeVersion.versionType === 'RECOMMENDED'">
                  &nbsp;({{$t('components.mpEditor.steps[0].fVer_recommended')}})
                </template>
              </option>
            </select>
          </div>

          <div class="input-control">
            <label for="mpType">{{$t('components.mpEditor.steps[0].type')}}</label>
            <select id="mpType" v-model="modPack.type" required>
              <option value="PUBLIC">{{$t('components.mpEditor.steps[0].types[0]')}}</option>
              <option value="PRIVATE">{{$t('components.mpEditor.steps[0].types[1]')}}</option>
            </select>
          </div>

          <transition name="fade">
            <div class="submit-control" v-if="canNextStep">
              <input type="submit" :value="$t('components.mpEditor.next') + ' >'" class="btn" @click.prevent="nextStep">
            </div>
          </transition>
        </template>
      </li>

      <li class="step-2" v-show="step === 2">
        <div class="input-control folderSelection">
          <label for="mpLogo">{{$t('components.mpEditor.steps[1].logo')}}</label>
          <input type="text" v-model="mpLogo" id="mpLogo" class="folderSelectInput"
            @click.prevent="selectMpLogo">
        </div>

        <label class="title" for="mpDescription">{{$t('components.mpEditor.steps[1].description')}}</label>
        <textarea id="mpDescription" v-model="modPack.description"></textarea>

        <label class="title" for="mpChangelog">{{$t('components.mpEditor.steps[1].changelog')}}</label>
        <textarea id="mpChangelog" v-model="modPack.changelog"></textarea>

        <div class="submit-control between full">
          <input type="submit" :value="'< ' + $t('components.mpEditor.previous')" class="btn"
            @click.prevent="previousStep">
          <template v-if="canNextStep">
            <input type="submit" :value="$t('components.mpEditor.next') + ' >'" class="btn" @click.prevent="nextStep">
          </template>
        </div>
      </li>

      <li class="step-3" v-show="step === 3">
        <template v-if="loaded">
          <h2 class="title">{{$t('components.mpEditor.steps[2].title')}}</h2>
          <table class="mods">
            <thead>
            <tr>
              <th>{{$t('components.mpEditor.steps[2].mods.name')}}</th>
              <th>{{$t('components.mpEditor.steps[2].mods.version')}}</th>
              <th>{{$t('components.mpEditor.steps[2].mods.authors')}}</th>
              <th>{{$t('components.mpEditor.steps[2].mods.description')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="mod in modPack.mods" track-by='$index'>
              <td>
                <input type="text" title="" :placeholder="$t('components.mpEditor.steps[2].mods.name')"
                  v-model="mod.name" maxlength="45" required>
              </td>
              <td>
                <input type="text" title="" :placeholder="$t('components.mpEditor.steps[2].mods.version')"
                  v-model="mod.version" maxlength="35" required>
              </td>
              <td>
                <input type="text" title="" :placeholder="$t('components.mpEditor.steps[2].mods.authors')"
                  v-model="mod.authors" required>
              </td>
              <td>
                <input type="text" title="" :placeholder="$t('components.mpEditor.steps[2].mods.description')"
                  v-model="mod.description" maxlength="255" required>
              </td>
            </tr>
            </tbody>
          </table>

          <h2 class="title">{{$t('components.mpEditor.steps[2].properties')}}</h2>
          <table class="mods">
            <thead>
            <tr>
              <th>{{$t('components.mpEditor.steps[2].mods.name')}}</th>
              <th>{{$t('components.mpEditor.steps[2].mods.mcVersion')}}</th>
              <th>{{$t('components.mpEditor.steps[2].mods.type')}}</th>
              <th>{{$t('components.mpEditor.steps[2].mods.side')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="mod in modPack.mods" track-by='$index'>
              <td><input type="text" :value="mod.name" disabled></td>
              <td><select v-model="mod.mcVersion" required>
                <option v-for="mcVersion in mcVersions" :value="mcVersion.version">{{mcVersion.version}}</option>
              </select></td>
              <td><select v-model="mod.type" required>
                <option value="CORE">{{$t('components.mpEditor.steps[2].mods.types[0]')}}</option>
                <option value="MODS">{{$t('components.mpEditor.steps[2].mods.types[1]')}}</option>
                <option value="OPTIONAL">{{$t('components.mpEditor.steps[2].mods.types[2]')}}</option>
              </select></td>
              <td><select v-model="mod.side" required>
                <option value="BOTH">{{$t('components.mpEditor.steps[2].mods.sides[0]')}}</option>
                <option value="SERVER">{{$t('components.mpEditor.steps[2].mods.sides[1]')}}</option>
                <option value="CLIENT">{{$t('components.mpEditor.steps[2].mods.sides[2]')}}</option>
              </select></td>
            </tr>
            </tbody>
          </table>

          <div class="submit-control between">
            <input type="submit" :value="'< ' + $t('components.mpEditor.previous')" class="btn"
              @click.prevent="previousStep">
            <template v-if="canNextStep">
              <input type="submit" :value="$t('components.mpEditor.next') + ' >'" class="btn" @click.prevent="nextStep">
            </template>
          </div>
        </template>

        <ProgressBar class="loadingMods" :progress="(total===0)?0:((current / total) * 100)" v-else>
          {{$t('components.mpEditor.steps[2].loading')}} ({{current}} / {{total}})
        </ProgressBar>
      </li>

      <li class="step-4" v-show="step === 4">
        <template v-if="loaded">
          <h1>The file is uploaded !</h1>
        </template>

        <ProgressBar class="uploading" :progress="Number(uploadProgress)" v-else>
          {{$t('components.mpEditor.steps[3].loading')}} ({{uploadProgress}} %, {{uploadSpeed}})
        </ProgressBar>
      </li>
    </ul>
  </form>

</template>

<script src="./index.js"></script>
<style src="./index.scss" lang="scss" scoped></style>
