module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.js'
      }
    },
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'koel-desktop-client',
        appId: 'com.electron.koel-desktop-client',
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        mac: {
          icon: 'src/assets/build/icons/icon.icns'
        },
        win: {
          icon: 'src/assets/build/icons/icon.ico'
        },
        linux: {
          icon: 'src/assets/build/icons',
          category: 'Audio'
        }
      }
    }
  }
}
