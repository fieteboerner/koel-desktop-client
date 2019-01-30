<template>
  <SongList
    :songs="songs"
    :value="[]"
    artist
    album
    @play=""
    @context=""
    >

  </SongList>
</template>
<script lang="ts">
import Vue from 'vue'
import { sortBy } from 'lodash'
import { Component, Mixins } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { playerModule, queueModule, mediaModule } from '@/store/namespaces'

import SongList from '@/components/shared/SongList.vue'
import { Artist, Song } from '@/interfaces';

@Component({
  components: {
    SongList,
  },
})
export default class Songs extends Vue {
  @mediaModule.Getter songs: Array<Song>
}
</script>