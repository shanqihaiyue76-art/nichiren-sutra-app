/**
 * 再生トランスポートの共通インターフェース。
 * 音声(<audio>)・YouTube など実装に依らず、再生画面はこの形だけを見る。
 */
export interface Transport {
  /** プレイヤー操作可能になったか */
  ready: boolean;
  isPlaying: boolean;
  /** 最後まで再生して止まった状態か（再生・シークで false に戻る） */
  ended: boolean;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  seek: (time: number) => void;
}
