import { defineStore } from 'pinia'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    permitido: null, // null = não decidido, true/false
    lat: null,
    lng: null,
    cep: '',
    cidade: '',
    bairro: '',
    estado: '',
    rua: '',
  }),
  actions: {
    setCoords({ lat, lng }) {
      this.lat = lat
      this.lng = lng
      this.permitido = true
    },
    setEndereco(endereco) {
      Object.assign(this, endereco)
    },
    negarPermissao() {
      this.permitido = false
    },
  },
})
