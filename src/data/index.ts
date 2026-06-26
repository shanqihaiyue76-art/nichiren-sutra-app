import type { Sutra } from "./types";
import { hobenpon } from "./hobenpon";
import { jigage } from "./jigage";

export { sources, getSource } from "./sources";

/**
 * 経文（内容層）の登録一覧。
 * 新しい経文を追加するときは、src/data/ にデータファイルを作り、
 * ここに import して配列へ追加する。
 */
export const sutras: Sutra[] = [hobenpon, jigage];

export function getSutra(id: string): Sutra | undefined {
  return sutras.find((s) => s.id === id);
}
