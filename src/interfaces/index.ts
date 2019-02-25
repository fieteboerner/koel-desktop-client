export interface Album {
  id: number,
  name: string,
  cover: string,
  artist_id: number,
  artist: Artist,
  songs: Song[],
}

export interface Artist {
  id: number,
  name: string,
  albums: Album[],
}

export interface Song {
  id: string,
  title: string,
  length: number,
  disc: number,
  album_id: number,
  album: Album,
  artist_id: number,
  artist: Artist,
  liked: boolean,
  playCount: number,
}

export interface Interaction {
  song_id: string,
  liked: boolean,
  play_count: number,
}

export interface QueueItem {
  id: string,
  playStart?: Date,
  playEnd?: Date,
  prio: boolean,
  song: Song,
}

export enum RepeatTypes {
  Off = 'OFF',
  All = 'ALL',
  One = 'ONE'
}