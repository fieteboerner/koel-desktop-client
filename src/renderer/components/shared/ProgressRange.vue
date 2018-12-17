<template>
  <div class="progress-range-root">
    <input type="range" :step="step" :value="val" :max="max" @input="change">
    <progress :value="val" :max="max"></progress>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class ProgessRange extends Vue {
  @Prop(Number) value
  @Prop({ type: Number, default: 100 }) max
  @Prop({ type: Number, default: 1 }) step

  val = this.value

  change (event) {
    this.val = parseInt(event.target.value)
    this.$emit('input', parseInt(this.val))
  }

  @Watch('value')
  onValueChanged (newValue) {
    if (parseInt(newValue) !== parseInt(this.val)) this.val = newValue
  }
}
</script>
<style lang="scss">
@import '../../../sass/settings';

.progress-range-root {
  margin: 0;
  display: inline-block;
  height: 1em;
  position: relative;

  input[type='range'],
  progress {
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 0;
    height: 12px;
    width: 100%;
  }
  input[type='range'] {
    z-index: 1;
    background: none;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid #cccccc;
      background: #ffffff;
    }
  }
  progress {
    top: 4px;
    height: 4px;
    $border-radius: 4px;
    border-radius: $border-radius;

    &::-webkit-progress-value {
      background: $primary;
      border-radius: $border-radius;
    }
    &::-webkit-progress-bar {
      background: $light-grey;
      border-radius: $border-radius;
    }
  }
}
</style>
