import { Switch } from '@medusajs/ui'
import { Tooltip } from '../copy/tooltip'
import { useColorMode } from './provider'

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Tooltip content={`toggle color mode`}>
      <Switch
        checked={isDark}
        onCheckedChange={() => toggleColorMode()}
        id="toggle-dark-mode"
      />
    </Tooltip>
  )
}
