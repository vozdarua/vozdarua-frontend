<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'

const props = defineProps({
  ocorrencias: { type: Array, default: () => [] },
  selecionada: { type: Object, default: null },
  center:      { type: Array,  default: () => [-23.2237, -45.9009] },
})
const emit = defineEmits(['select-pin'])

const mapEl = ref(null)
let map = null
let clusterGroup = null
const markerMap = new Map() // id → marker

const SPREAD_RADIUS = 0.00022

function coordKey(lat, lng) {
  return `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`
}

// SVG pin normal
function svgNormal() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#475569"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`
}

// SVG pin selecionado — teal com anel branco
function svgSelected() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
    <circle cx="19" cy="19" r="19" fill="white" opacity="0.9"/>
    <path d="M19 4C11.268 4 5 10.268 5 18c0 9.333 14 22 14 22S33 27.333 33 18C33 10.268 26.732 4 19 4z" fill="#0d9488"/>
    <circle cx="19" cy="18" r="7" fill="white"/>
  </svg>`
}

function makeLeafletIcon(selected) {
  return L.divIcon({
    html: selected ? svgSelected() : svgNormal(),
    className: '',
    iconSize:   selected ? [38, 48] : [28, 36],
    iconAnchor: selected ? [19, 48] : [14, 36],
  })
}

function spreadCoords(validos) {
  const grupos = {}
  for (const oc of validos) {
    const key = coordKey(oc.address.latitude, oc.address.longitude)
    if (!grupos[key]) grupos[key] = []
    grupos[key].push(oc)
  }
  return validos.map((oc) => {
    const key = coordKey(oc.address.latitude, oc.address.longitude)
    const grupo = grupos[key]
    const n = grupo.length
    if (n === 1) return { oc, lat: oc.address.latitude, lng: oc.address.longitude }
    const idx = grupo.indexOf(oc)
    const angle = (2 * Math.PI / n) * idx - Math.PI / 2
    return {
      oc,
      lat: oc.address.latitude + SPREAD_RADIUS * Math.cos(angle),
      lng: oc.address.longitude + SPREAD_RADIUS * Math.sin(angle) / Math.cos(oc.address.latitude * Math.PI / 180),
    }
  })
}

function rebuildMarkers() {
  if (!map || !clusterGroup) return

  clusterGroup.clearLayers()
  markerMap.clear()

  const validos = props.ocorrencias.filter(
    (oc) => oc.address?.latitude != null && oc.address?.longitude != null
  )

  for (const { oc, lat, lng } of spreadCoords(validos)) {
    const selected = props.selecionada?.id === oc.id
    const marker = L.marker([lat, lng], {
      icon: makeLeafletIcon(selected),
      zIndexOffset: selected ? 1000 : 0,
    })
    marker.on('click', () => emit('select-pin', oc))
    markerMap.set(oc.id, marker)
    clusterGroup.addLayer(marker)
  }
}

function refreshSelectedIcon() {
  for (const [id, marker] of markerMap) {
    const selected = props.selecionada?.id === id
    marker.setIcon(makeLeafletIcon(selected))
    marker.setZIndexOffset(selected ? 1000 : 0)
  }
}

onMounted(() => {
  map = L.map(mapEl.value, { zoomControl: true }).setView(props.center, 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map)

  clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 60,
    disableClusteringAtZoom: 16,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    iconCreateFunction(cluster) {
      const count = cluster.getChildCount()
      const size = count < 10 ? 36 : count < 100 ? 44 : 52
      return L.divIcon({
        html: `<div style="
          width:${size}px;height:${size}px;
          background:#0d9488;
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
          color:white;font-weight:700;font-size:${count < 10 ? 14 : 12}px;
          font-family:Inter,sans-serif;
        ">${count}</div>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })
    },
  })

  map.addLayer(clusterGroup)
  rebuildMarkers()
})

onUnmounted(() => {
  map?.remove()
  map = null
})

watch(() => props.ocorrencias, rebuildMarkers, { deep: true })
watch(() => props.selecionada, refreshSelectedIcon)
watch(() => props.center, (c) => { if (map && c) map.flyTo(c, 13, { duration: 1 }) })
</script>

<template>
  <div ref="mapEl" style="height:100%;width:100%" />
</template>
