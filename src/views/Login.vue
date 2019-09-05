<template>
  <div class="login">
    <form
      class="login-form"
      :class="{ 'animation-shake-horizontal': showErrorAnimation }"
      @submit.prevent="login"
      @animationend="showErrorAnimation = false"
    >
      <div class="form-field">
        <input
          v-model="url"
          class="form-input"
          placeholder="Koel-Server-URL: https://..."
          required
          @blur="errors.url = null"
        >
        <div v-if="errors.url" class="form-field-error">
          {{ errors.url[0] }}
        </div>
      </div>
      <div class="form-field">
        <input
          v-model="email"
          class="form-input"
          placeholder="E-Mail"
          required
          :autofocus="!email"
          @blur="errors.mail = null"
        >
        <div v-if="errors.mail" class="form-field-error">
          {{ errors.mail[0] }}
        </div>
      </div>
      <div class="form-field">
        <input
          v-model="password"
          class="form-input"
          type="password"
          placeholder="Password"
          required
          :autofocus="!!email"
          @blur="errors.password = null"
        >
        <div v-if="errors.password" class="form-field-error">
          {{ errors.password[0] }}
        </div>
      </div>
      <button
        class="form-button"
        :class="{ 'is-loading': isLoading }"
        type="submit"
      >
        Login
      </button>
    </form>
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
      @authModule.Getter isLoading

      url = ''
      email = ''
      password = ''
      errors = {}
      showErrorAnimation = false

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
            this.errors = { password: ['Invalid credentials'] }
            break
          default:
            this.errors = { email: ['An unknown error occurred'] }
            break
          }

          this.showErrorAnimation = true
        }
      }
}
</script>
<style lang="scss" scoped>
@import "@/styles/app";

.login {
  align-items: center;
  background-color: $light;
  display: flex;
  height: 100vh;
  justify-content: center;
  position: relative;
}

.login-form {
  background-color: white;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1), 0 5px 5px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  max-width: 450px;
  padding: 2.5rem;
  width: 33.333%;
}

.form-input {
  background-color: $light;
  border: 0;
  box-sizing: border-box;
  display: block;
  font-size: 17px;
  outline: 0;
  padding: 1em;
  transition: background-color 150ms ease-in;
  width: 100%;

  &:focus {
    background-color: darken($light, 5%);
  }
}

.form-field {
  margin-bottom: 1.5rem;

}

.form-field-error {
  color: $danger;
  font-size: 14px;
}

.form-button {
  background-color: $primary;
  border: 0;
  color: $white;
  cursor: pointer;
  display: flex;
  font-size: 17px;
  font-weight: bold;
  outline: 0;
  padding: 1em;
  text-transform: uppercase;
  transition-duration: 150ms;
  transition-property: background-color, opacity;
  transition-timing-function: ease-in;
  width: 100%;

  &.is-loading {
    opacity: 0.5;
    pointer-events: none;

    &::before {
      @extend %loader;

      margin-right: 1em;
    }
  }
  &:hover,
  &:focus {
    background-color: darken($primary, 10%);
  }
}
</style>
