<template>
  <header-component @openDrawer="leftDrawerOpen = !leftDrawerOpen"/>
  <drawer-component :value="leftDrawerOpen" @closeDrawer="closeDrawer" >
    <slot name="drawer"/>
  </drawer-component>
    <q-page-container class="full-height">
      <q-page>
        <slot />
      </q-page>
    </q-page-container>
  <footer-component v-if="hasAuthToken" />
</template>

<script>
import HeaderComponent from "components/main/HeaderComponent";
import DrawerComponent from "components/main/DrawerComponent";
import FooterComponent from "components/main/FooterComponent";

export default {
  name: 'MainLayout',
  components: {
    HeaderComponent,
    DrawerComponent,
    FooterComponent,
  },
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' }
  },
  data() {
    return {
      leftDrawerOpen: false,
    }
  },
  computed: {
    hasAuthToken() {
      return this.$store.getters['user/getAuthTokenStatus']
    }
  },
  methods: {
    closeDrawer(value) {
      this.leftDrawerOpen = value
    }
  }
}
</script>
