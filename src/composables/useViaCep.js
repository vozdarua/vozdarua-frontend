import * as locationService from '@/services/location'
import { useGeolocationStore } from '@/stores/geolocation'
import { useGeolocation } from '@/composables/useGeolocation'

export function useViaCep() {
  const geoStore = useGeolocationStore()
  const { geocodeAddress } = useGeolocation()

  async function buscarCep(cep) {
    const limpo = cep.replace(/\D/g, '')
    if (limpo.length !== 8) throw new Error('CEP inválido')

    const data = await locationService.buscarCep(limpo)
    const endereco = {
      cep: data.cep,
      rua: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      estado: data.state,
    }

    geoStore.setEndereco(endereco)

    // Geocodifica em background para obter lat/lng e acionar o pin no mapa
    geocodeAddress(endereco)
      .then(({ lat, lng }) => geoStore.setCoords({ lat, lng }))
      .catch(() => {}) // silencia se Nominatim falhar

    return endereco
  }

  return { buscarCep }
}
