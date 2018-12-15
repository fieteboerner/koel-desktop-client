import { Album, Artist, Song, QueueItem, RepeatTypes } from "@/interfaces";

export interface RootState {
    auth: AuthState
    media: MediaState
    player: PlayerState
    queue: QueueState
}

export interface AuthState {
    token: string
    url: string
    email: string
    user: object
}

export interface MediaState {
  loading: boolean
  albums: Album[]
  artists: Artist[]
  songs: Song[]
}

export interface PlayerState {
  initialized: boolean
  playing: boolean
  player: any
  currentTime: number,
  repeatModes: RepeatTypes[]
  options: {
    repeat: RepeatTypes
    shuffle: boolean
    volume: number
    muted: boolean
  }
}

export interface QueueState {
  context?: string
  contextActive: boolean
  queue: QueueItem[]
  history: QueueItem[]
  current: QueueItem|any
}