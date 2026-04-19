import useAppStore from '../store/appStore'
import { UTILITY_COLORS } from '../config/utilities'

export function useUtilityColor(utilityId) {
  const colorMode = useAppStore((s) => s.colorMode)
  const appColor  = useAppStore((s) => s.appColor)
  return colorMode === 'app' ? appColor : UTILITY_COLORS[utilityId]
}
