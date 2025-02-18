export type KanjiDetails = {
  onyomi: string[],
  kunyomi: string[],
  meaning: string,
}
export type Kanji = Record<string, KanjiDetails>;

export * from './kanji-5';
export * from './kanji-4';
export * from './kanji-3';

// TOADD 犬 陽 星





