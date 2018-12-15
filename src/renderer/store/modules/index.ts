/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
import auth from './auth'
import Media from './Media'
import Player from './Player'
import queue from './queue'

const modules = {
  auth,
  queue,
  Media: Media,
  Player: Player,
}

export default modules
