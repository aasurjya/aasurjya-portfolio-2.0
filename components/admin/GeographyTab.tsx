'use client'

import React, { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { Bar } from 'react-chartjs-2'
import {
  Globe, MapPin, BarChart3, Flag, ZoomIn, ZoomOut, RotateCcw,
  ChevronRight, Building
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true }
  }
}

interface GeoCity {
  city: string
  count: number
}

interface GeoState {
  state: string
  count: number
  cities: GeoCity[]
}

interface GeoCountry {
  country: string
  count: number
  states: GeoState[]
}

interface LocationData {
  lat: number
  lng: number
  city: string
  count: number
}

interface GeographyTabProps {
  locations: LocationData[]
  topCountries: { country: string; count: number }[]
  topCities: { city: string; count: number }[]
  geographyData: GeoCountry[]
  totalVisitors: number
}

// Error boundary for chart sections
class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackTitle?: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallbackTitle?: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Chart error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-card p-6 rounded-xl border flex flex-col items-center justify-center min-h-[200px] text-center">
          <p className="text-muted-foreground mb-2">
            {this.props.fallbackTitle || 'Failed to load this section'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function GeographyTab({
  locations,
  topCountries,
  topCities,
  geographyData,
  totalVisitors,
}: GeographyTabProps) {
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set())
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set())
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20])
  const mapLoadedRef = useRef(false)

  // Pre-compute country lookup: Map<lowercaseName, count>
  const countryLookup = useMemo(() => {
    const map = new Map<string, number>()
    topCountries.forEach(c => {
      if (c.country) map.set(c.country.toLowerCase(), c.count)
    })
    return map
  }, [topCountries])

  const maxCountryCount = useMemo(
    () => topCountries[0]?.count || 1,
    [topCountries]
  )

  // Memoize the geographies render callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderGeography = useCallback(
    (geo: any) => {
      const geoName = geo.properties.name || geo.properties.NAME || ''
      const geoNameLower = geoName.toLowerCase()

      // Fast lookup instead of .find() on every geography
      let count = countryLookup.get(geoNameLower) || 0
      if (!count) {
        // Fallback: partial match
        const entries = Array.from(countryLookup.entries())
        for (let j = 0; j < entries.length; j++) {
          const [name, c] = entries[j]
          if (name.includes(geoNameLower) || geoNameLower.includes(name)) {
            count = c
            break
          }
        }
      }

      const hasVisitors = count > 0
      const intensity = hasVisitors ? Math.min(count / maxCountryCount, 1) : 0

      return (
        <Geography
          key={geo.rsmKey}
          geography={geo}
          fill={hasVisitors ? `rgba(99, 102, 241, ${0.3 + intensity * 0.5})` : '#334155'}
          stroke="#475569"
          strokeWidth={0.4}
          style={{
            default: { outline: 'none' },
            hover: {
              fill: hasVisitors ? '#818cf8' : '#3f4f63',
              outline: 'none',
              cursor: 'pointer'
            },
            pressed: { outline: 'none' }
          }}
        />
      )
    },
    [countryLookup, maxCountryCount]
  )

  // Memoize bar chart data
  const countryBarData = useMemo(() => ({
    labels: topCountries.slice(0, 8).map(c => c.country),
    datasets: [{
      data: topCountries.slice(0, 8).map(c => c.count),
      backgroundColor: topCountries.slice(0, 8).map((_, i) =>
        `rgba(99, 102, 241, ${1 - i * 0.1})`
      ),
      borderRadius: 6,
      borderSkipped: false as const,
    }]
  }), [topCountries])

  const countryBarOptions = useMemo(() => ({
    ...chartOptions,
    indexAxis: 'y' as const,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        cornerRadius: 8,
      }
    }
  }), [])

  // Only render top 5 markers with pulse rings, rest are static
  const maxCityCount = useMemo(() => topCities[0]?.count || 1, [topCities])

  return (
    <motion.div
      key="geography"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Enhanced World Map */}
      <ChartErrorBoundary fallbackTitle="Failed to load world map">
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Global Visitor Distribution
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {locations.length} locations tracked across {topCountries.length} countries
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">Active regions</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Map Stats Overlay - Hidden on mobile */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 space-y-2 hidden sm:block">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 border shadow-lg">
              <p className="text-xs text-muted-foreground">Total Locations</p>
              <p className="text-xl sm:text-2xl font-bold">{locations.length}</p>
            </div>
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 border shadow-lg">
              <p className="text-xs text-muted-foreground">Top Country</p>
              <p className="text-base sm:text-lg font-semibold">{topCountries[0]?.country || 'N/A'}</p>
              <p className="text-xs text-primary">{topCountries[0]?.count || 0} visitors</p>
            </div>
          </div>

          {/* Legend - Smaller on mobile */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 border shadow-lg">
            <p className="text-xs font-medium mb-1 sm:mb-2 hidden sm:block">Visitor Density</p>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary/30" />
              <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-primary/50" />
              <span className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-primary/70" />
              <span className="w-4.5 h-4.5 sm:w-7 sm:h-7 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground ml-1 sm:ml-2 hidden sm:inline">Low → High</span>
            </div>
          </div>

          <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 relative">
            {/* Zoom Controls */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex flex-col gap-1">
              <button
                onClick={() => setMapZoom(z => Math.min(z * 1.5, 8))}
                className="p-1.5 sm:p-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-lg hover:bg-background transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setMapZoom(z => Math.max(z / 1.5, 1))}
                className="p-1.5 sm:p-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-lg hover:bg-background transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => { setMapZoom(1); setMapCenter([0, 20]); }}
                className="p-1.5 sm:p-2 bg-background/90 backdrop-blur-sm rounded-lg border shadow-lg hover:bg-background transition-colors"
                title="Reset view"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute top-2 right-14 sm:top-4 sm:right-20 z-20 bg-background/90 backdrop-blur-sm rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 border shadow-lg hidden sm:block">
              <span className="text-xs text-muted-foreground">{Math.round(mapZoom * 100)}%</span>
            </div>

            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900/80">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="text-sm text-slate-400">Loading world map...</span>
                </div>
              </div>
            )}
            {locations.length === 0 && mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border text-center">
                  <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No visitor locations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Locations appear when visitors allow geolocation</p>
                </div>
              </div>
            )}
            <ComposableMap
              projectionConfig={{ scale: 147, center: [0, 30] }}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Removed expensive feGaussianBlur SVG filter */}
              <ZoomableGroup
                zoom={mapZoom}
                center={mapCenter}
                onMoveEnd={({ coordinates, zoom }) => {
                  setMapCenter(coordinates as [number, number])
                  setMapZoom(zoom)
                }}
                minZoom={1}
                maxZoom={8}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) => {
                    if (geographies.length > 0 && !mapLoadedRef.current) {
                      mapLoadedRef.current = true
                      setTimeout(() => setMapLoaded(true), 0)
                    }
                    return geographies.map(renderGeography)
                  }}
                </Geographies>

                {/* Visitor Markers — deduplicated by city, pulse rings on top 5 only */}
                {locations.map((loc, i) => {
                  const size = (5 + (loc.count / maxCityCount) * 10) / mapZoom
                  const showPulse = i < 5

                  return (
                    <Marker key={`${loc.city}-${loc.lat}-${loc.lng}`} coordinates={[loc.lng, loc.lat]}>
                      <g>
                        {showPulse && (
                          <circle r={size + 6 / mapZoom} fill="none" stroke="#818cf8" strokeWidth={1.5 / mapZoom} opacity={0.3}>
                            <animate attributeName="r" from={size} to={size + 15 / mapZoom} dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle r={size} fill="#6366f1" stroke="#fff" strokeWidth={1.5 / mapZoom} />
                        <circle r={size * 0.4} fill="#fff" opacity={0.8} />
                      </g>
                      <title>{`${loc.city}: ${loc.count} visitor${loc.count > 1 ? 's' : ''}`}</title>
                    </Marker>
                  )
                })}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
      </ChartErrorBoundary>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCountries.slice(0, 4).map((country, i) => (
          <motion.div
            key={country.country}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-4 rounded-xl border"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                i === 0 ? 'bg-yellow-500/10' :
                i === 1 ? 'bg-slate-500/10' :
                i === 2 ? 'bg-amber-500/10' : 'bg-muted'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🌍'}
              </div>
              <div>
                <p className="font-medium">{country.country}</p>
                <p className="text-sm text-muted-foreground">{country.count} visitors</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Geographic Hierarchy: Country → State → City */}
      <div className="bg-card rounded-xl border">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            Geographic Breakdown
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Click to expand Country → State/Region → City
          </p>
        </div>
        <div className="divide-y max-h-[350px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
          {geographyData?.map((country, countryIdx) => {
            const isCountryExpanded = expandedCountries.has(country.country)
            const countryPercentage = Math.round((country.count / totalVisitors) * 100)

            return (
              <div key={country.country} className="group">
                <button
                  onClick={() => {
                    const newExpanded = new Set(expandedCountries)
                    if (isCountryExpanded) {
                      newExpanded.delete(country.country)
                    } else {
                      newExpanded.add(country.country)
                    }
                    setExpandedCountries(newExpanded)
                  }}
                  className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <motion.div
                    animate={{ rotate: isCountryExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    countryIdx === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                    countryIdx === 1 ? 'bg-slate-500/20 text-slate-600' :
                    countryIdx === 2 ? 'bg-amber-500/20 text-amber-600' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {countryIdx < 3 ? ['🥇', '🥈', '🥉'][countryIdx] : <Globe className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{country.country}</span>
                      <span className="text-sm font-medium">{country.count} visitors</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${countryPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10">{countryPercentage}%</span>
                    </div>
                  </div>
                </button>

                {/* States Level */}
                <AnimatePresence>
                  {isCountryExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-muted/30"
                    >
                      {country.states.map((state) => {
                        const stateKey = `${country.country}-${state.state}`
                        const isStateExpanded = expandedStates.has(stateKey)
                        const statePercentage = Math.round((state.count / country.count) * 100)

                        return (
                          <div key={stateKey}>
                            <button
                              onClick={() => {
                                const newExpanded = new Set(expandedStates)
                                if (isStateExpanded) {
                                  newExpanded.delete(stateKey)
                                } else {
                                  newExpanded.add(stateKey)
                                }
                                setExpandedStates(newExpanded)
                              }}
                              className="w-full pl-12 pr-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left border-t border-muted/50"
                            >
                              <motion.div
                                animate={{ rotate: isStateExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </motion.div>
                              <Building className="w-4 h-4 text-blue-500" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">{state.state}</span>
                                  <span className="text-sm text-muted-foreground">{state.count}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{ width: `${statePercentage}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground w-8">{statePercentage}%</span>
                                </div>
                              </div>
                            </button>

                            {/* Cities Level */}
                            <AnimatePresence>
                              {isStateExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  {state.cities.map((city) => {
                                    const cityPercentage = Math.round((city.count / state.count) * 100)
                                    return (
                                      <div
                                        key={city.city}
                                        className="pl-20 pr-4 py-2 flex items-center gap-3 bg-muted/20 border-t border-muted/30"
                                      >
                                        <MapPin className="w-3 h-3 text-green-500" />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm">{city.city}</span>
                                            <span className="text-xs text-muted-foreground">{city.count}</span>
                                          </div>
                                          <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex-1 h-0.5 bg-muted rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${cityPercentage}%` }}
                                              />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-8">{cityPercentage}%</span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <ChartErrorBoundary fallbackTitle="Failed to load geography charts">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            Visitors by Country
          </h3>
          <div className="h-56 sm:h-64 lg:h-72">
            <Bar data={countryBarData} options={countryBarOptions} />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            Top Cities
          </h3>
          <div className="space-y-3">
            {topCities.slice(0, 8).map((city, i) => {
              const maxCount = topCities[0]?.count || 1
              const percentage = Math.round((city.count / maxCount) * 100)
              return (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {city.city}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">{city.count}</span>
                  </div>
                  <div className="ml-9 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`h-full rounded-full ${
                        i === 0 ? 'bg-primary' :
                        i === 1 ? 'bg-primary/80' :
                        i === 2 ? 'bg-primary/60' : 'bg-primary/40'
                      }`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </ChartErrorBoundary>
    </motion.div>
  )
}
