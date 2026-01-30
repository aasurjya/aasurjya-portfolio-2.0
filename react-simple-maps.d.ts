declare module 'react-simple-maps' {
  import { FC, ReactNode } from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, any>
    width?: number
    height?: number
    style?: React.CSSProperties
    children?: ReactNode
  }

  export interface Geography {
    rsmKey: string
    [key: string]: any
  }

  export interface GeographiesRenderProps {
    geographies: Geography[]
    projection?: any
  }

  export interface GeographiesProps {
    geography: string | Record<string, any>
    children?: (props: GeographiesRenderProps) => ReactNode
  }

  export interface GeographyProps {
    geography?: Geography
    style?: Record<string, Record<string, any>>
    onMouseEnter?: (geography: Geography) => void
    onMouseLeave?: () => void
    onClick?: (geography: Geography) => void
    fill?: string
    stroke?: string
    children?: ReactNode
  }

  export interface MarkerProps {
    coordinates: [number, number]
    style?: Record<string, Record<string, any>>
    onClick?: () => void
    children?: ReactNode
  }

  export const ComposableMap: FC<ComposableMapProps>
  export const Geographies: FC<GeographiesProps>
  export const Geography: FC<GeographyProps>
  export const Marker: FC<MarkerProps>
}
