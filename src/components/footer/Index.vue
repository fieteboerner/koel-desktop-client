<template>
  <div class="footer-root" tabindex="-1">
    <div class="current-song">
      <CurrentSong />
    </div>
    <div class="controls-wrapper timeline">
      <div class="controls">
        <div class="buttons level">
          <b-icon icon="shuffle" :class="{active: shuffle}" @click.native="toggleShuffle" />
          <b-icon icon="skip-previous" @click.native="back" />
          <b-icon
            v-if="!playing"
            icon="play-circle-outline"
            size="is-large"
            @click.native="resume"
          />
          <b-icon
            v-else
            icon="pause-circle-outline"
            size="is-large"
            @click.native="pause"
          />
          <b-icon icon="skip-next" @click.native="skip" />
          <b-icon :icon="repeatIcon" :class="{active: ['ONE', 'ALL'].indexOf(repeat) > -1}" @click.native="toggleRepeat" />
        </div>
      </div>
      <SeekBar />
    </div>
    <div class="special-control">
      <b-icon icon="playlist-play" @click.native="queueListActive = true" />
      <b-modal :active.sync="queueListActive" :can-cancel="['escape', 'outside']">
        <QueueList />
      </b-modal>
      <VolumeControl />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import CurrentSong from './CurrentSong.vue'
import QueueList from './QueueList.vue'
import SeekBar from './SeekBar.vue'
import VolumeControl from './VolumeControl.vue'

import { playerModule } from '@/store/namespaces'
import { Song } from '@/interfaces'

@Component({
  components: {
    CurrentSong,
    QueueList,
    SeekBar,
    VolumeControl,
  }
})
export default class Index extends Vue {
  queueListActive = false
  @playerModule.Action back
  @playerModule.Action pause
  @playerModule.Action resume
  @playerModule.Action skip

  @playerModule.Getter('current') currentSong
  @playerModule.Getter playing
  @playerModule.Getter repeat
  @playerModule.Getter shuffle

  @playerModule.Mutation toggleRepeat
  @playerModule.Mutation toggleShuffle

  get repeatIcon() {
    return this.repeat === 'ONE' ? 'repeat-once' : 'repeat'
  }
}
</script>
<style lang="scss">
@import '../../styles/settings';

.modal {
  justify-content: flex-start;
  padding-top: 80px;

  .modal-card, .modal-content {
    max-height: calc(100vh - 120px);
  }
  .modal-content {
    width: 960px;
  }
}
.footer-root {
  flex: 1;
  display: flex;
  height: 75px;
  align-items: center;
  user-select: none;
  cursor: default;


  .controls-wrapper {
    flex: 1;
  }

  .controls {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .buttons {
    margin-bottom: 0;
    width: 250px;

    & .active {
      color: $primary;
    }
  }

  .buttons {
    margin-bottom: 0;
    width: 250px;
  }

  .special-control {
    width: 350px;
    display: flex;
    margin: 0 1.5rem 0 1rem;
    justify-content: flex-end;

    >.icon {
      margin-right: 0.75rem;
    }
  }
}
</style>
