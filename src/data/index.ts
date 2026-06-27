import type { Sutra } from "./types";
import { kaikyoge } from "./kaikyoge";
import { hobenpon } from "./hobenpon";
import { jigage } from "./jigage";
import { daimoku } from "./daimoku";
import { ekomonChogyo } from "./ekomon-chogyo";
import { hotoge } from "./hotoge";
import { shishi } from "./shishi";

export { sources, getSource } from "./sources";

/**
 * 経文（内容層）の登録一覧。
 * 新しい経文を追加するときは、src/data/ にデータファイルを作り、
 * ここに import して配列へ追加する。
 * 登録順 = 基本勤行の読経順: 開経偈 → 方便品 → 自我偈 → 題目 → 回向文 → 宝塔偈 → （以降追加）
 */
export const sutras: Sutra[] = [kaikyoge, hobenpon, jigage, daimoku, ekomonChogyo, hotoge, shishi];

export function getSutra(id: string): Sutra | undefined {
  return sutras.find((s) => s.id === id);
}
