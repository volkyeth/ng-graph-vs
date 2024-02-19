import { ElementDefinition } from "cytoscape"
import { atom } from "jotai"
import { atomWithLocation } from "jotai-location"

const locationAtom = atomWithLocation()
export const graphIdAtom = atom((get) => {
  const pathName = get(locationAtom).pathname
  if (!pathName) return undefined
  if (pathName === "/") return undefined
  return pathName.substring(1)
}, (get, set, newId: string) => {
  const currentLocation = get(locationAtom)
  set(locationAtom, {...currentLocation, pathname: "/" + newId})
})

export const DEFAULT_GRAPH_STATE: ElementDefinition[] = [{
    data: {
      conviction: 1,
    },
    classes: "point",
    position: { x: 100, y: 100 },
  },]

export const graphStateAtom = atom((get) => {
  const graphId = get(graphIdAtom)
  if (!graphId) return DEFAULT_GRAPH_STATE
  const stringifiedState = window.localStorage.getItem(graphId)
  if (!stringifiedState) return DEFAULT_GRAPH_STATE
  return JSON.parse(stringifiedState) as ElementDefinition[]
}, (get, _set, newGraphState: string[]) => {
  const graphId = get(graphIdAtom)
  if (!graphId) return
  window.localStorage.setItem(graphId, JSON.stringify(newGraphState))
})