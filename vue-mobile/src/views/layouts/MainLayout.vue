<template>
  <header-component :title="title" :description="description" @openDrawer="leftDrawerOpen = !leftDrawerOpen"/>
  <drawer-component :value="leftDrawerOpen" @closeDrawer="closeDrawer" >
    <slot name="drawer"/>
  </drawer-component>
    <q-page-container>
      <q-page>
        <slot />
      </q-page>
    </q-page-container>
</template>

<script>
import HeaderComponent from "components/main/HeaderComponent";
import DrawerComponent from "components/main/DrawerComponent";

export default {
  name: 'MainLayout',
  components: {
    HeaderComponent,
    DrawerComponent
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
  methods: {
    closeDrawer(value) {
      this.leftDrawerOpen = value
    }
  }
}
</script>
