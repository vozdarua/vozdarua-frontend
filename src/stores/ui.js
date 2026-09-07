import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    locationModalOpen: false,
    cityStatsModalOpen: false,
    categoryModalOpen: false,
    drawerOpen: false,
    drawerFullscreen: false,
    loading: false,
  }),
  actions: {
    openLocationModal() {
      this.locationModalOpen = true
    },
    closeLocationModal() {
      this.locationModalOpen = false
    },
    openDrawer() {
      this.drawerOpen = true
    },
    closeDrawer() {
      this.drawerOpen = false
      this.drawerFullscreen = false
    },
    toggleDrawerFullscreen() {
      this.drawerFullscreen = !this.drawerFullscreen
    },
    setLoading(value) {
      this.loading = value
    },
  },
})
