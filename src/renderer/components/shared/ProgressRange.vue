<template>
  <div class="progress-range-root">
    <input type="range" step="1" :value="val" :max="max" @input="change">
    <progress :value="val" :max="max"></progress>
  </div>
</template>
<script>
export default {
  props: {
    value: Number,
    max: {
      type: Number,
      default () {
        return 100
      }
    }
  },
  data () {
    return {
      val: this.value
    }
  },
  methods: {
    change (event) {
      this.val = event.target.value
      this.$emit('input', parseInt(this.val))
    }
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
