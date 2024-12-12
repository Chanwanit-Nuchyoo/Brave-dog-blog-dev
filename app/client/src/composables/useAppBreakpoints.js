import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const useAppBreakpoints = () => {
  return useBreakpoints(breakpointsTailwind)
}

export default useAppBreakpoints
