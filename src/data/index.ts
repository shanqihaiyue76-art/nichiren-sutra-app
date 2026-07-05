import type { Sutra } from "./types";
import { kaikyoge } from "./kaikyoge";
import { hobenpon } from "./hobenpon";
import { jigage } from "./jigage";
import { daimoku } from "./daimoku";
import { ekomonChogyo } from "./ekomon-chogyo";
import { hotoge } from "./hotoge";
import { shishi } from "./shishi";
import { jinrikige } from "./jinrikige";
import { kannonge } from "./kannonge";
import { daibadatta } from "./daibadatta";
import { fugenkanpatsuge } from "./fugenkanpatsuge";
import { johon } from "./johon";
import { hobenponzenbun } from "./hobenponzenbun";
import { hiyuhon } from "./hiyuhon";
import { shingehon } from "./shingehon";
import { yakusoyuhon } from "./yakusoyuhon";
import { jukihon } from "./jukihon";
import { kejohon } from "./kejohon";
import { gohyakuhon } from "./gohyakuhon";
import { jugakuhon } from "./jugakuhon";
import { hosshihon } from "./hosshihon";
import { hotohon } from "./hotohon";
import { kanjihon } from "./kanjihon";
import { anrakugyohon } from "./anrakugyohon";
import { juchiyujutsuhon } from "./juchiyujutsuhon";
import { juryohon } from "./juryohon";
import { funbetsukudokuhon } from "./funbetsukudokuhon";
import { zuikikudokuhon } from "./zuikikudokuhon";
import { hosshikudokuhon } from "./hosshikudokuhon";
import { jofukyohon } from "./jofukyohon";
import { jinrikihon } from "./jinrikihon";
import { zokuruihon } from "./zokuruihon";
import { yakuohon } from "./yakuohon";

export { sources, getSource } from "./sources";

/**
 * 経文（内容層）の登録一覧。
 * 新しい経文を追加するときは、src/data/ にデータファイルを作り、
 * ここに import して配列へ追加する。
 * 登録順 = 基本勤行の読経順: 開経偈 → 方便品 → 自我偈 → 題目 → 回向文 → 宝塔偈 → （以降追加）
 * 法華経二十八品は基本勤行の後に章番号順で追加。
 */
export const sutras: Sutra[] = [kaikyoge, hobenpon, jigage, daimoku, ekomonChogyo, hotoge, shishi, jinrikige, kannonge, daibadatta, fugenkanpatsuge, johon, hobenponzenbun, hiyuhon, shingehon, yakusoyuhon, jukihon, kejohon, gohyakuhon, jugakuhon, hosshihon, hotohon, kanjihon, anrakugyohon, juchiyujutsuhon, juryohon, funbetsukudokuhon, zuikikudokuhon, hosshikudokuhon, jofukyohon, jinrikihon, zokuruihon, yakuohon];

export function getSutra(id: string): Sutra | undefined {
  return sutras.find((s) => s.id === id);
}
