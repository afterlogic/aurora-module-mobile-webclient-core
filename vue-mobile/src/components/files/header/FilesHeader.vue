<template>
  <q-toolbar style="height: 55px" class="justify-between">
     <q-btn flat size="15px" @click="$emit('openDrawer')" color="black" round dense icon="menu" />
     <div class="flex column">
       <q-btn-dropdown
         model-value
         v-model="isOpen"
         dense
         :disable="paths.length <= 1"
         :style="{
          'padding-left': '36px',
           'font-size': '17px',
           width: '250px',
          }"
         class="text-bold text-black"
         no-caps
         flat
         :label="paths.length <= 1 ? 'Aurora files' : getShortName(paths[paths.length - 1].name, 20)"
       >
         <q-list>
           <div v-for="(path, index) in paths"
                 :key="path.path"
           >
             <q-item clickable
                     v-close-popup
                     @click="openPath(path)"
                     v-if="paths.length - 1 !== index"
             >
               <q-item-section>
                 <q-item-label>{{ getShortName(path.name, 20) }}</q-item-label>
               </q-item-section>
             </q-item>
           </div>
         </q-list>
       </q-btn-dropdown>
       <span :style="{'margin-top': '-10px'}" class="text-black text-center text-blue-grey-12">{{storageName}}</span>
     </div>
     <q-btn flat size="15px" color="black" round dense icon="search" />
  </q-toolbar>
</template>

<script>
import { getShortName } from "src/utils/files/utils";

export default {
  name: "FilesHeader",
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    paths() {
      return this.$store.getters['files/getCurrentPaths']
    },
    storageName() {
      const currentStorage = this.$store.getters['files/getCurrentStorage']
      return currentStorage.Type
    }
  },
  watch: {
    paths(val) {
      console.log(val, 'paths')
    }
  },
  methods: {
    getShortName,
    async openPath(path) {
      this.isOpen = false
      await this.$store.dispatch('files/changeCurrentPaths', { path, lastStorage: false })
      await this.$store.dispatch('files/asyncGetFiles', {
        path: path.path
      })
    }
  }
}
</script>

<style scoped>

</style>
