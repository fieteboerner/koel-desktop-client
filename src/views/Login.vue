<template>
  <div class="hero _is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-grey">
            Login
          </h3>
          <p class="subtitle has-text-grey">
            Login to listen.
          </p>
          <div class="box">
            <figure class="avatar">
              <img src="https://placehold.it/128x128" alt="Logo">
            </figure>
            <form class="login" @submit.prevent="login">
              <b-field :type="errors.url ? 'is-danger' : ''" :message="errors.url">
                <b-input v-model="url" placeholder="Koel-URL" required />
              </b-field>
              <b-field :type="errors.email ? 'is-danger' : ''" :message="errors.email">
                <b-input
                  v-model="email"
                  placeholder="E-Mail"
                  required
                  autofocus
                />
              </b-field>
              <b-field :type="errors.password ? 'is-danger' : ''" :message="errors.password">
                <b-input
                  v-model="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </b-field>
              <b-field>
                <button class="button is-fullwidth is-info" type="submit">
                  Login
                </button>
              </b-field>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import { authModule } from '@/store/namespaces'
import MessageCenter from '@/services/MessageCenter'

@Component
export default class Login extends Vue {
      @authModule.Action setUrl
      @authModule.Action('login') authRequest
      @authModule.Getter('url') storeUrl
      @authModule.Getter('email') storeEmail

      url = ''
      email = ''
      password = ''
      errors = {}

      mounted() {
        this.url = this.storeUrl
        this.email  = this.storeEmail
      }

      async login () {
        const { email, password, url } = this
        this.setUrl(url)
        try {
          await this.authRequest({
            email,
            password
          })
          this.errors = {}
          this.$router.push('/')
        } catch (error) {
          const { response } = error
          if (!response) {
            throw error
          }

          switch (response.status) {
          case 422:
            this.errors = response.data
            break
          case 401:
            this.errors = { password: 'Invalid credentials' }
            break
          default:
            this.errors = { email: 'An unknown error occurred' }
            break
          }
        }
      }
}
</script>
<style scoped>
.hero {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  right: 0;
}

.box {
  margin-top: 5rem;
}

.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
}

.avatar img {
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
p {
  font-weight: 700;
}
p.subtitle {
  padding-top: 1rem;
}
</style>
