import cytoscape from 'cytoscape'
import { atom, useAtomValue } from 'jotai'

export const cyInstanceAtom = atom<cytoscape.Core | null>(null)
export const useCyInstance = () => useAtomValue(cyInstanceAtom)
