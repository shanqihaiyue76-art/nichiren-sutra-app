/**
 * 再生トランスポートの共通インターフェース。
 * 音声(<audio>)・YouTube など実装に依らず、再生画面はこの形だけを見る。
 */
export interface Transport {
  /** プレイヤー操作可能になったか */
  ready: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  seek: (time: number) => void;
}
