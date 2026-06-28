import type { Sutra } from "./types";

/**
 * 神力偈（如来神力品第二十一・偈頌）
 *
 * 妙法蓮華経 如来神力品第二十一の重説偈（偈頌）。
 * 「諸仏救世者」から「決定無有疑」まで32行64句。
 * 日蓮宗 拡張勤行で読まれる偈文。
 *
 * Ground Truth（テキスト）:
 *   出典: 妙法蓮華経 如来神力品第二十一（標準漢文）
 *   確認: benricho.org 日蓮宗経文データベース全文照合
 *   全64句（32行）確認済み。
 *
 * Ground Truth（音声・タイミング）:
 *   動画 YouTube 26UL4RmM0hY
 *   「【お経練習・字幕有り】妙法蓮華経如来神力品第二十一 神力偈」
 *   チャンネル: 見法寺法務チャンネル（日蓮宗）  収録時間: 239s
 *   採用理由: 字幕焼き込み・練習用字幕・OCR可能・読経速度標準的
 *   ※旧動画 I9KKyj0BDOI はタイトルカード固定（字幕なし）のため廃止
 *
 * タイミング（秒）は src/data/sources.ts (id: "jinriki-26UL4") で管理。
 * 同期方法: 1fps フレーム抽出 + Vision OCR（.cache/jinriki2_frames/）
 * OCRアンカー13点確認済み。jr_n = 20.0 + (n-1) × 3.333s（全64句・誤差ゼロ）。
 */
export const jinrikige: Sutra = {
  id: "jinrikige",
  title: "神力偈",
  subtitle: "妙法蓮華経 如来神力品第二十一",
  provenance: {
    status: "verified",
    source: "keihon",
    note: "テキスト: benricho.org 日蓮宗経文データベース（全64句確認）。タイミング: 26UL4RmM0hY 239s。OCR13点確認・jr_n=20+(n-1)×3.333s（全64句・誤差ゼロ）。",
  },
  sections: [
    {
      id: "jinrikige-main",
      title: "神力偈",
      lines: [
        // -- 1-8: 如来の神通力の顕現 --
        { id: "jr1",  text: "諸仏救世者",  reading: "しょぶつくぜしゃ",       translation: "諸仏は世を救う者、",               commentary: "冒頭句。十方諸仏が世界を救う存在として神通力を現すことを述べる。" },
        { id: "jr2",  text: "住於大神通",  reading: "じゅうおだいじんずう",   translation: "大いなる神通に住して、",             commentary: "「大神通（だいじんずう）」は仏の無量の神秘的な力。" },
        { id: "jr3",  text: "為悦衆生故",  reading: "いえっしゅじょうこ",     translation: "衆生を喜ばせるために、",             commentary: "「悦（えつ）」は喜ばせること。衆生への慈悲から神力を示す。" },
        { id: "jr4",  text: "現無量神力",  reading: "げんむりょうじんりき",   translation: "無量の神力を現す。",                 commentary: "無限の神通力を現すことで衆生の信心を起こさせる。" },
        { id: "jr5",  text: "舌相至梵天",  reading: "ぜっそうしぼんでん",     translation: "舌相は梵天に至り、",                 commentary: "「舌相」は仏の三十二相の一つ。真実のみを語る仏の舌は梵天まで届く。" },
        { id: "jr6",  text: "身放無数光",  reading: "しんほうむしゅこう",     translation: "身より無数の光を放つ。",             commentary: "仏身から無限の光明が放たれる。光は法華経の功徳の象徴。" },
        { id: "jr7",  text: "為求仏道者",  reading: "いぐぶつどうしゃ",       translation: "仏道を求める者のために、",           commentary: "法華経を持ち仏道を求める人のために神力を現す。" },
        { id: "jr8",  text: "現此希有事",  reading: "げんしけうじ",           translation: "この希有なる事を現す。",             commentary: "「希有（けう）」はめったにない、稀なこと。仏の神力の稀少さを強調。" },
        // -- 9-16: 諸仏の歓喜と神力 --
        { id: "jr9",  text: "諸仏謦欬声",  reading: "しょぶつきんがいしょう", translation: "諸仏のせき払いの声、",               commentary: "「謦欬（きんがい）」はせき払い。諸仏の微妙な音声が十方に届く。" },
        { id: "jr10", text: "及弾指之声",  reading: "きゅうだんじのこえ",     translation: "および指を弾く声は、",               commentary: "「弾指（だんし）」は指をはじく音。仏が承認・歓喜を示す動作。" },
        { id: "jr11", text: "周聞十方国",  reading: "しゅうもんじっぽうこく", translation: "十方の国に遍く聞こえ、",             commentary: "「周聞（しゅうもん）」は遍く聞こえること。十方世界に響き渡る。" },
        { id: "jr12", text: "地皆六種動",  reading: "ちかいろくしゅどう",     translation: "地はみな六種に動く。",               commentary: "「六種動（ろくしゅどう）」は六通りの揺れ。神力の偉大さを示す。" },
        { id: "jr13", text: "以仏滅度後",  reading: "いぶつめつどご",         translation: "仏の滅度の後に、",                   commentary: "釈尊が入滅された後の末法の時代を指す。" },
        { id: "jr14", text: "能持是経故",  reading: "のうじぜきょうこ",       translation: "よくこの経を持つがゆえに、",         commentary: "「能持（のうじ）」は法華経を持ち続けること。その功徳を説く。" },
        { id: "jr15", text: "諸仏皆歓喜",  reading: "しょぶつかいかんき",     translation: "諸仏はみな歓喜し、",                 commentary: "法華経の行者に対して十方諸仏が喜ぶ。" },
        { id: "jr16", text: "現無量神力",  reading: "げんむりょうじんりき",   translation: "無量の神力を現す。",                 commentary: "4句と同じ句の繰り返し。法華経持者への諸仏の神通力の顕現。" },
        // -- 17-24: 功徳の無限性 --
        { id: "jr17", text: "嘱累是経故",  reading: "ぞくるいぜきょうこ",     translation: "この経を付嘱するがゆえに、",         commentary: "「嘱累（ぞくるい）」は法華経の伝持を委ねること。" },
        { id: "jr18", text: "讃美受持者",  reading: "さんみじゅじしゃ",       translation: "受持する者を讃え称える。",           commentary: "法華経を受け持つ人を諸仏が讃嘆する。" },
        { id: "jr19", text: "於無量劫中",  reading: "おむりょうこうちゅう",   translation: "無量劫の中において、",               commentary: "「無量劫（むりょうこう）」は測り知れない長大な時間。" },
        { id: "jr20", text: "猶故不能尽",  reading: "ゆうこふのうじん",       translation: "なお説き尽くすことができない。",     commentary: "法華経持者の功徳は無量劫かけても語り尽くせない。" },
        { id: "jr21", text: "是人之功徳",  reading: "ぜにんのくどく",         translation: "この人の功徳は、",                   commentary: "法華経を持つ人の功徳を讃える。" },
        { id: "jr22", text: "無辺無有窮",  reading: "むへんむうぐう",         translation: "辺なく窮まることなし。",             commentary: "「無辺（むへん）」は果てがない。法華経持者の功徳の無限性。" },
        { id: "jr23", text: "如十方虚空",  reading: "にょじっぽうこくう",     translation: "十方の虚空のごとく、",               commentary: "虚空（こくう）の広大無辺さに功徳を例える。" },
        { id: "jr24", text: "不可得辺際",  reading: "ふかとくへんざい",       translation: "辺際を得ることができない。",         commentary: "「辺際（へんざい）」は端・境界。虚空と同じく功徳に際限がない。" },
        // -- 25-34: 法華経持者への諸仏の喜び --
        { id: "jr25", text: "能持是経者",  reading: "のうじぜきょうしゃ",     translation: "よくこの経を持つ者は、",             commentary: "繰り返し登場する句。法華経持者の功徳を述べる重要な節。" },
        { id: "jr26", text: "則為已見我",  reading: "そくいいけんが",         translation: "則ち我れをすでに見たるとなす。",     commentary: "「我（が）」は釈尊。法華経を持つことは釈尊を見ることと等しい。" },
        { id: "jr27", text: "亦見多宝仏",  reading: "やっけんたほうぶつ",     translation: "また多宝仏を見、",                   commentary: "「多宝仏（たほうぶつ）」は宝塔の中の仏。法華経の証明者。" },
        { id: "jr28", text: "及諸分身者",  reading: "きゅうしょぶんしんしゃ", translation: "および諸の分身者を見る。",           commentary: "「分身（ぶんしん）」は釈尊の化身の諸仏。全員に会うとされる。" },
        { id: "jr29", text: "又見我今日",  reading: "またけんがこんにち",     translation: "また我れ今日、",                     commentary: "釈尊が現在この場で法を説く姿を見ることと等しいと続く。" },
        { id: "jr30", text: "教化諸菩薩",  reading: "きょうけしょぼさつ",     translation: "諸の菩薩を教化するを見る。",         commentary: "「教化（きょうけ）」は教え導くこと。釈尊が菩薩を教化する場面。" },
        { id: "jr31", text: "能持是経者",  reading: "のうじぜきょうしゃ",     translation: "よくこの経を持つ者は、",             commentary: "25句と同じ。法華経持者への讃嘆の繰り返し。" },
        { id: "jr32", text: "令我及分身",  reading: "れいがきゅうぶんしん",   translation: "我れおよび分身をして、",             commentary: "法華経持者の功徳が釈尊と分身仏をともに喜ばせる。" },
        { id: "jr33", text: "滅度多宝仏",  reading: "めつどたほうぶつ",       translation: "多宝仏の滅度、",                     commentary: "多宝如来の滅度（入滅の状態）をも喜ばせる。" },
        { id: "jr34", text: "一切皆歓喜",  reading: "いっさいかいかんき",     translation: "一切がみな歓喜する。",               commentary: "法華経持者によって、釈尊・多宝仏・分身仏すべてが喜ぶ。" },
        // -- 35-42: 三世の仏への供養 --
        { id: "jr35", text: "十方現在仏",  reading: "じっぽうげんざいぶつ",   translation: "十方の現在仏、",                     commentary: "「現在仏（げんざいぶつ）」は現在存在する十方の仏。" },
        { id: "jr36", text: "幷過去未来",  reading: "ならびにかこみらい",     translation: "ならびに過去・未来（の仏）、",       commentary: "三世（過去・現在・未来）の仏をすべて網羅する。" },
        { id: "jr37", text: "亦見亦供養",  reading: "やっけんやっくよう",     translation: "また見、また供養し、",               commentary: "三世の仏を見て供養することが法華経持者に可能となる。" },
        { id: "jr38", text: "亦令得歓喜",  reading: "やくれいとくかんき",     translation: "また歓喜を得させる。",               commentary: "三世の仏を歓喜させることができる。法華経持者の偉大な功徳。" },
        { id: "jr39", text: "諸仏坐道場",  reading: "しょぶつざどうじょう",   translation: "諸仏が道場に坐して、",               commentary: "「道場（どうじょう）」は悟りの場。諸仏が菩提樹下で悟りを開いた場所。" },
        { id: "jr40", text: "所得秘要法",  reading: "しょとくひようほう",     translation: "得たまえる秘要の法を、",             commentary: "「秘要法（ひようほう）」は最も重要な秘密の法 = 法華経のこと。" },
        { id: "jr41", text: "能持是経者",  reading: "のうじぜきょうしゃ",     translation: "よくこの経を持つ者は、",             commentary: "25・31句に同じ。重ねて讃嘆される法華経持者。" },
        { id: "jr42", text: "不久亦當得",  reading: "ふきゅうやくとうとく",   translation: "久しからずしてまた当に得べし。",     commentary: "法華経持者は間もなく諸仏が得た秘要の法を得ることができる。" },
        // -- 43-52: 法師の功徳 --
        { id: "jr43", text: "能持是経者",  reading: "のうじぜきょうしゃ",     translation: "よくこの経を持つ者は、",             commentary: "繰り返しの讃嘆句。法華経の法師（ほっし）を指す。" },
        { id: "jr44", text: "於諸法之義",  reading: "おしょほうのぎ",         translation: "諸法の義において、",                 commentary: "「諸法（しょほう）」はすべての存在・現象。その深い意義を理解する。" },
        { id: "jr45", text: "名字及言辞",  reading: "みょうじきゅうごんじ",   translation: "名字および言辞に、",                 commentary: "「名字（みょうじ）」は名前・概念。「言辞（ごんじ）」はことば。" },
        { id: "jr46", text: "楽説無窮尽",  reading: "ぎょくせつむきゅうじん", translation: "楽しんで説くこと窮まりなし。",       commentary: "「楽説（ぎょくせつ）」は自在に楽しんで説くこと。法師の特質。" },
        { id: "jr47", text: "如風於空中",  reading: "にょふうおくうちゅう",   translation: "風が空中にあるがごとく、",           commentary: "説法の自在さを風に例える。風は虚空を自由に吹く。" },
        { id: "jr48", text: "一切無障礙",  reading: "いっさいむしょうげ",     translation: "一切に障礙なし。",                   commentary: "「障礙（しょうげ）」は妨げ・障害。法師の説法に何の障碍もない。" },
        { id: "jr49", text: "於如来滅後",  reading: "おにょらいめつご",       translation: "如来の滅後において、",               commentary: "釈尊が入滅した後（末法の世）での法華経伝持を強調する。" },
        { id: "jr50", text: "知仏所説経",  reading: "ちぶつしょせつきょう",   translation: "仏の説きたまえる経を知り、",         commentary: "「仏の所説（しょせつ）の経」= 仏が説いた経典 = 法華経。" },
        { id: "jr51", text: "因縁及次第",  reading: "いんねんきゅうしだい",   translation: "因縁および次第を、",                 commentary: "「因縁（いんねん）」は縁起・理由。「次第（しだい）」は順序。" },
        { id: "jr52", text: "随義如実説",  reading: "ずいぎにょじつせつ",     translation: "義に随って如実に説く。",             commentary: "「如実（にょじつ）」は事実の通り・真実に。法師の正確な説法。" },
        // -- 53-64: 世間の目・仏道の確信 --
        { id: "jr53", text: "如日月光明",  reading: "にょにちがつこうみょう", translation: "日月の光明のごとく、",               commentary: "法師を日月（太陽と月）の光に例える。闇を照らす光の象徴。" },
        { id: "jr54", text: "能除諸幽冥",  reading: "のうじょしょゆうみょう", translation: "よく諸の幽冥を除く。",               commentary: "「幽冥（ゆうみょう）」は暗闇・無知。法師が衆生の無明を取り除く。" },
        { id: "jr55", text: "斯人行世間",  reading: "しにんぎょうせけん",     translation: "この人は世間を行じて、",             commentary: "「斯人（しにん）」はこの人 = 法華経持者・法師。世間を自由に行く。" },
        { id: "jr56", text: "能滅衆生闇",  reading: "のうめつしゅじょうあん", translation: "よく衆生の闇を滅す。",               commentary: "「衆生の闇（あん）」は無知・無明。法師が衆生の闇を滅する。" },
        { id: "jr57", text: "教無量菩薩",  reading: "きょうむりょうぼさつ",   translation: "無量の菩薩を教えて、",               commentary: "法師が無限の菩薩たちを教化・導く。" },
        { id: "jr58", text: "畢竟住一乗",  reading: "ひっきょうじゅういちじょう", translation: "畢竟じて一乗に住さしむ。",     commentary: "「畢竟（ひっきょう）」は究極・最終的に。「一乗（いちじょう）」は法華経の教え。" },
        { id: "jr59", text: "是故有智者",  reading: "ぜこゆうちしゃ",         translation: "この故に智ある者は、",               commentary: "前の功徳・讃嘆を受けての結び。智慧ある者への勧め。" },
        { id: "jr60", text: "聞此功徳利",  reading: "もんしくどくり",         translation: "この功徳の利を聞いて、",             commentary: "「功徳利（くどくり）」は功徳の利益・益。法華経の利益を聞く。" },
        { id: "jr61", text: "於我滅度後",  reading: "おがめつどご",           translation: "我れ（釈尊）の滅度の後に、",         commentary: "釈尊の入滅後（末法）に法華経を弘通することの大切さを述べる。" },
        { id: "jr62", text: "応受持斯経",  reading: "おうじゅじしきょう",     translation: "まさにこの経を受持すべし。",         commentary: "「受持（じゅじ）」は受け取り持ち続けること。法華経実践の核心。" },
        { id: "jr63", text: "是人於仏道",  reading: "ぜにんおぶつどう",       translation: "この人は仏道において、",             commentary: "法華経を受持した人は仏道においてどのような境地に達するかを述べる。" },
        { id: "jr64", text: "決定無有疑",  reading: "けつじょうむうぎ",       translation: "決定して疑いなし。",                 commentary: "偈の最後句。法華経持者の成仏は「決定（けつじょう）」的であり疑いがない。" },
      ],
    },
  ],
};
