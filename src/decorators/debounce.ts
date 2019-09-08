import { debounce, DebounceSettings } from 'lodash'

export const Debounce = (duration: number, options?: DebounceSettings): Function => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    return {
      ...descriptor,
      value: debounce(descriptor.value, duration, options)
    }
  }
}

export default Debounce
