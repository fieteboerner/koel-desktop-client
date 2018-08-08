/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
import Auth from './Auth'
import Media from './Media'
import Player from './Player'
import Queue from './Queue'

const modules = {
  Auth: Auth,
  Media: Media,
  Player: Player,
  Queue: Queue,
}

export default modules
