import axios from 'axios'
import { useGeolocationStore } from '@/stores/geolocation'

const NOMINATIM_URL = import.meta.env.VITE_NOMINATIM_URL

export function useGeolocation() {
  const store = useGeolocationStore()

  function pedirPermissao() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        store.negarPermissao()
        reject(new Error('Geolocalização não suportada'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          store.setCoords({ lat, lng })
          try {
            const endereco = await reverseGeocode(lat, lng)
            store.setEndereco(endereco)
          } catch {
            // ignora falha de reverse geocode, mantém coordenadas
          }
          resolve(store)
        },
        () => {
          store.negarPermissao()
          reject(new Error('Permissão negada'))
        }
      )
    })
  }

  async function reverseGeocode(lat, lng) {
    const { data } = await axios.get(`${NOMINATIM_URL}/reverse`, {
      params: { lat, lon: lng, format: 'json' },
    })
    const addr = data.address || {}
    return {
      cidade: addr.city || addr.town || addr.municipality || '',
      bairro: addr.suburb || addr.neighbourhood || '',
      estado: addr.state || '',
      rua: addr.road || '',
      cep: addr.postcode || '',
    }
  }

  async function geocodeAddress({ rua, bairro, cidade, estado }) {
    const q = [rua, bairro, cidade, estado].filter(Boolean).join(', ')
    const { data } = await axios.get(`${NOMINATIM_URL}/search`, {
      params: { q, format: 'json', limit: 1 },
    })
    if (!data || data.length === 0) throw new Error('Endereço não encontrado')
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  }

  return { pedirPermissao, reverseGeocode, geocodeAddress, store }
}
