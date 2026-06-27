import type { Sutra } from "./types";

/**
 * 回向文（朝夕勤行）
 *
 * 日蓮宗 朝夕勤行の回向文。将来の複数種追加を前提に
 * sutraId を "ekomon-chogyo" と種別付きにしている。
 * 将来追加例: ekomon-segaki, ekomon-hoyo, ekomon-eitai, ekomon-obon
 *
 * 基準動画 _oN7QCtk3lk の 952〜1044 秒区間（回向文セクション）。
 * 全39行、P67-P70 の 4 ページにまたがる。
 *
 * Ground Truth:
 *   動画 YouTube _oN7QCtk3lk（朝夕の勤行 19 分）の 950s〜1044s 区間を
 *   1fps フレーム抽出 + Vision OCR で全行確認。
 *   【回向文】マーカー（P67〜P70）が表示される区間で字幕が一行ずつ積み上がる形式。
 *
 *   タイミングは Whisper large-v3 セグメント開始時刻（W）と
 *   フレーム表示時刻 -1.5s の推定（D）を組み合わせた Hybrid 法。
 *
 *   動画文字: "大曼茶羅勧請の"（茶）← 動画 OCR の GT どおり表記。
 *
 * タイミング（秒）は src/data/sources.ts の timings で管理する。
 */
export const ekomonChogyo: Sutra = {
  id: "ekomon-chogyo",
  title: "回向文（朝夕勤行）",
  subtitle: "功徳を三宝・先祖に回向する文",
  provenance: {
    status: "provisional",
    source: "ocr_draft",
    note: "全39行を動画フレームOCR（_oN7QCtk3lk 950-1044s, 1fps, P67-P70）で確認。タイミングはWhisper large-v3 + フレーム表示時刻推定（Hybrid）。",
  },
  sections: [
    {
      id: "kudoku-hokoku",
      title: "功徳奉告",
      lines: [
        {
          id: "ec1",
          text: "ご宝前に於いて",
          reading: "ごほうぜんにおいて",
          translation: "御仏・御本尊のご宝前において、",
          commentary: "勤行の功徳を仏前に報告する書き出し。「宝前（ほうぜん）」は御本尊のおそば。",
        },
        {
          id: "ec2",
          text: "心から妙法蓮華経と",
          reading: "こころからみょうほうれんげきょうと",
          translation: "心から妙法蓮華経と、",
          commentary: "妙法蓮華経（法華経）を唱えたことを報告する。",
        },
        {
          id: "ec3",
          text: "大聖人のお言葉を",
          reading: "だいしょうにんのおことばを",
          translation: "日蓮大聖人のお言葉（御書）を、",
          commentary: "日蓮大聖人（1222-1282）の御書（著作）の拝読を指す。",
        },
        {
          id: "ec4",
          text: "拝読し",
          reading: "はいどくし",
          translation: "謹んで拝読し、",
          commentary: "経典・御書を敬いながら読誦したことを表す。",
        },
        {
          id: "ec5",
          text: "お題目を",
          reading: "おだいもくを",
          translation: "お題目（南無妙法蓮華経）を、",
          commentary: "題目＝南無妙法蓮華経。日蓮宗の根本唱句。",
        },
        {
          id: "ec6",
          text: "お唱えした功徳を",
          reading: "おとなえしたくどくを",
          translation: "お唱えした功徳（善根）を、",
          commentary: "読誦・唱題によって積まれた功徳をもって回向する。",
        },
        {
          id: "ec7",
          text: "大曼茶羅勧請の",
          reading: "だいまんだらかんじょうの",
          translation: "大曼荼羅にご降臨いただいた",
          commentary: "大曼荼羅は日蓮大聖人が書かれた御本尊。勧請は諸仏・諸尊を招き請うこと。",
        },
        {
          id: "ec8",
          text: "諸尊に捧げ",
          reading: "しょそんにささげ",
          translation: "諸尊（仏・菩薩・諸天善神）に捧げ、",
          commentary: "大曼荼羅に勧請された釈尊・諸菩薩・諸天善神に功徳を奉納する。",
        },
      ],
    },
    {
      id: "ekomon-taishо",
      title: "回向の対象",
      lines: [
        {
          id: "ec9",
          text: "末法の導師",
          reading: "まっぽうのどうし",
          translation: "末法時代の導師たる",
          commentary: "末法（まっぽう）は釈尊滅後の時代区分のひとつ。日蓮大聖人は末法の導師とされる。",
        },
        {
          id: "ec10",
          text: "日蓮大聖人始め",
          reading: "にちれんだいしょうにんはじめ",
          translation: "日蓮大聖人をはじめ、",
          commentary: "宗祖・日蓮大聖人（1222-1282）。法華経を弘めた日蓮宗の開祖。",
        },
        {
          id: "ec11",
          text: "法華経の行者に",
          reading: "ほけきょうのぎょうじゃに",
          translation: "法華経の行者（歴代の師僧・法師）に",
          commentary: "法華経を修行・弘通した歴代の師僧すべてを指す。",
        },
        {
          id: "ec12",
          text: "回向します",
          reading: "えこうします",
          translation: "功徳を回向いたします。",
          commentary: "回向（えこう）は自らの功徳を他者に向けること。日蓮宗の回向の根本精神。",
        },
      ],
    },
    {
      id: "sekai-heiwa",
      title: "世界平和の祈願",
      lines: [
        {
          id: "ec13",
          text: "仰ぎ祈らくは",
          reading: "あおぎいのらくは",
          translation: "仰ぎ願いますことは、",
          commentary: "「祈らくは（いのらくは）」は古語で「願いますことは」の意。仏に向かって祈願を述べる書き出し。",
        },
        {
          id: "ec14",
          text: "仏様の",
          reading: "ほとけさまの",
          translation: "仏様の",
          commentary: "",
        },
        {
          id: "ec15",
          text: "大慈悲に依り",
          reading: "だいじひによ り",
          translation: "大いなる慈悲のおかげで、",
          commentary: "「大慈悲（だいじひ）」は仏・菩薩の大いなる慈しみと憐れみ。",
        },
        {
          id: "ec16",
          text: "世界平和 国土安穏",
          reading: "せかいへいわ こくどあんのん",
          translation: "世界に平和が訪れ、国土が安らかでありますように。",
          commentary: "日蓮宗の立正安国（りっしょうあんこく）の精神に基づく祈願。",
        },
        {
          id: "ec17",
          text: "万民の心が",
          reading: "ばんみんのこころが",
          translation: "すべての人々の心が、",
          commentary: "「万民（ばんみん）」はあらゆる人々。",
        },
        {
          id: "ec18",
          text: "安らかで",
          reading: "やすらかで",
          translation: "安らかで、",
          commentary: "",
        },
        {
          id: "ec19",
          text: "あります様に",
          reading: "ありますように",
          translation: "ありますように。",
          commentary: "世界平和の祈願の締めくくり。",
        },
      ],
    },
    {
      id: "kojin-shugyо",
      title: "個人修行の祈願",
      lines: [
        {
          id: "ec20",
          text: "さらには",
          reading: "さらには",
          translation: "さらには、",
          commentary: "次の祈願への転換句。",
        },
        {
          id: "ec21",
          text: "全ての皆々が",
          reading: "すべてのみなみなが",
          translation: "すべての皆々が、",
          commentary: "",
        },
        {
          id: "ec22",
          text: "はるか昔からの",
          reading: "はるかむかしからの",
          translation: "はるか昔からの、",
          commentary: "過去世（前世）からの罪業を指す。",
        },
        {
          id: "ec23",
          text: "罪を懺悔し",
          reading: "つみをさんげし",
          translation: "罪を懺悔し（ざんげし）、",
          commentary: "「懺悔（さんげ）」は仏前で過去の罪を告白し赦しを求めること。",
        },
        {
          id: "ec24",
          text: "罪障を消滅し",
          reading: "ざいしょうをしょうめつし",
          translation: "罪の障りを消し滅ぼし、",
          commentary: "「罪障（ざいしょう）」は成仏を妨げる罪業。法華経の功徳によって消滅するとされる。",
        },
        {
          id: "ec25",
          text: "信心に励み",
          reading: "しんじんにはげみ",
          translation: "信心に励み、",
          commentary: "法華経への信仰を深め、日々の修行に努めること。",
        },
        {
          id: "ec26",
          text: "そして",
          reading: "そして",
          translation: "そして、",
          commentary: "",
        },
        {
          id: "ec27",
          text: "健康で過ごせます様に",
          reading: "けんこうですごせますように",
          translation: "健康で過ごせますように。",
          commentary: "身体の健康を仏に祈る。日々の修行を続けるための健康を願う。",
        },
      ],
    },
    {
      id: "senzo-kuyo",
      title: "先祖供養",
      lines: [
        {
          id: "ec28",
          text: "また",
          reading: "また",
          translation: "また、",
          commentary: "先祖供養の祈願へ転換する句。",
        },
        {
          id: "ec29",
          text: "当家の先祖代々の諸霊位",
          reading: "とうけのせんぞだいだいのしょれいい",
          translation: "この家の先祖代々のすべての霊位（みたま）を、",
          commentary: "「諸霊位（しょれいい）」は亡くなった先祖・親族すべてを指す。",
        },
        {
          id: "ec30",
          text: "そして",
          reading: "そして",
          translation: "そして、",
          commentary: "",
        },
        {
          id: "ec31",
          text: "有縁無縁の諸霊位を",
          reading: "うえんむえんのしょれいいを",
          translation: "縁あるものもなきものも、すべての霊位を、",
          commentary: "「有縁（うえん）」は縁のある人、「無縁（むえん）」は縁なき霊。すべてに供養を捧げる。",
        },
        {
          id: "ec32",
          text: "供養します",
          reading: "くようします",
          translation: "供養いたします。",
          commentary: "「供養（くよう）」は物を捧げて故人の冥福を祈ること。功徳を回向することで供養する。",
        },
      ],
    },
    {
      id: "eko-ge",
      title: "廻向偈",
      lines: [
        {
          id: "ec33",
          text: "願わくば",
          reading: "ねがわくば",
          translation: "願わくば、",
          commentary: "廻向偈（えこうげ）の書き出し。法華経・浄土宗など各宗派の廻向偈に共通する句。",
        },
        {
          id: "ec34",
          text: "この功徳を以て",
          reading: "このくどくをもって",
          translation: "この功徳をもって、",
          commentary: "勤行・唱題で積んだ功徳を指す。",
        },
        {
          id: "ec35",
          text: "普く一切に及ぼし",
          reading: "あまねくいっさいにおよぼし",
          translation: "あまねくすべてのものに及ぼし、",
          commentary: "「普く（あまねく）」はすべて・あまねく。功徳をすべての衆生に回向する。",
        },
        {
          id: "ec36",
          text: "我等と衆生と",
          reading: "われらとしゅじょうと",
          translation: "私たちとすべての衆生が、",
          commentary: "「衆生（しゅじょう）」はすべての生き物。自他ともに成仏を願う。",
        },
        {
          id: "ec37",
          text: "皆共に仏道を",
          reading: "みなともにぶつどうを",
          translation: "皆ともに仏道を、",
          commentary: "仏道＝成仏への道。一切衆生の成仏を願う。",
        },
        {
          id: "ec38",
          text: "成ぜんことを",
          reading: "じょうぜんことを",
          translation: "成就できますように。",
          commentary: "廻向偈の結び。「成ぜん」は成就する・成し遂げるの意。",
        },
        {
          id: "ec39",
          text: "南無妙法蓮華経",
          reading: "なむみょうほうれんげきょう",
          translation: "妙法蓮華経に帰依申し上げます。",
          commentary: "回向文の締めくくりとして唱える題目。",
        },
      ],
    },
  ],
};
