import { ToastProgrammatic as Toast } from 'buefy'

class MessageCenter {
  error(message: string) {
    Toast.open({
      message,
      type: 'is-danger',
      duration: 5000,
    })
  }
}

export default new MessageCenter()
