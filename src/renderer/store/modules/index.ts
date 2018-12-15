/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
import auth from './auth'
import media from './media'
import player from './player'
import queue from './queue'

const modules = {
  auth,
  media,
  player,
  queue,
}

export default modules
