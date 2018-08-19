export interface Album {
  id: number,
  name: string,
  cover: string,
  artist_id: number,
  artist: Artist,
  songs: Song[],
}

export interface Artist {
  id: 0,
  name: '',
  albums: Album[],
}

export interface Song {
  id: number,
  title: string,
  length: number,
  disc: number,
  album_id: number,
  album: Album,
  artist_id: number,
  artist: Artist,
}