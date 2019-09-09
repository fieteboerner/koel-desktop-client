export enum KeyCodes {
  ENTER = 13,
  SHIFT = 16,
  SPACE = 32,
  ARROW_UP = 38,
  ARROW_DOWN = 40,
  DELETE = 46,
  A = 65,
  D = 68,
  J = 74,
  K = 75,
  O = 79,
}

interface KeyMap<T> {
  [action: T]: KeyCodes[]
}

export enum ListNavigationActions {
  UP,
  DOWN,
  OPEN,
  DELETE,
  SELECT_ALL,
}

export const ListNavigationMap: KeyMap<ListNavigationActions> = {
  [ListNavigationActions.UP]: [KeyCodes.ARROW_UP, KeyCodes.K],
  [ListNavigationActions.DOWN]: [KeyCodes.ARROW_DOWN, KeyCodes.J],
  [ListNavigationActions.OPEN]: [KeyCodes.ENTER, KeyCodes.O],
  [ListNavigationActions.DELETE]: [KeyCodes.DELETE, KeyCodes.D],
  [ListNavigationActions.SELECT_ALL]: [KeyCodes.A],
}

export const isValidKey = (keyMap: KeyMap<any>, event: KeyboardEvent): boolean => {
  return Object
    .values(keyMap)
    .some(group => group.includes(event.keyCode))
}

export const isActionPressed = (keyMap: KeyMap<any>, event:KeyboardEvent, action: any): boolean => {
  return keyMap[action].includes(event.keyCode)
}

export const isCmdOrCtrlPressed  = (event: KeyboardEvent): Boolean => {
  return Boolean(event.metaKey || event.ctrlKey)
}
