// macOS Vision フレームワークによる日本語OCR（信頼度付き）
//
// 基準動画フレームから経文テキストを抽出するための OCR。
// Vision の VNRecognizeTextRequest は日本語精度が高く、行ごとに confidence(0..1) を返す。
// usesLanguageCorrection=false：古典経文を現代語へ「補正」されないよう既定で無効。
//
// コンパイル: swiftc -O scripts/vision_ocr.swift -o .cache/vision_ocr
// 実行:       .cache/vision_ocr <image.png> [--correct]
// 出力:       JSON {image, lines:[{text, confidence, x, y, w, h}]}
//             座標は Vision 既定（原点=左下, 正規化0..1）。順序付けは後段で行う。

import Foundation
import Vision

let args = CommandLine.arguments
guard args.count >= 2 else {
    FileHandle.standardError.write("usage: vision_ocr <image> [--correct]\n".data(using: .utf8)!)
    exit(2)
}
let path = args[1]
let useCorrection = args.contains("--correct")

let url = URL(fileURLWithPath: path)
guard FileManager.default.fileExists(atPath: path) else {
    FileHandle.standardError.write("file not found: \(path)\n".data(using: .utf8)!)
    exit(2)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.recognitionLanguages = ["ja"]
request.usesLanguageCorrection = useCorrection
request.minimumTextHeight = 0.0

let handler = VNImageRequestHandler(url: url, options: [:])
do {
    try handler.perform([request])
} catch {
    FileHandle.standardError.write("OCR failed: \(error)\n".data(using: .utf8)!)
    exit(1)
}

struct Line: Codable {
    let text: String
    let confidence: Float
    let x: Double; let y: Double; let w: Double; let h: Double
}
struct Out: Codable {
    let image: String
    let correct: Bool
    let lines: [Line]
}

var lines: [Line] = []
if let results = request.results as? [VNRecognizedTextObservation] {
    for obs in results {
        guard let top = obs.topCandidates(1).first else { continue }
        let b = obs.boundingBox
        lines.append(Line(text: top.string, confidence: top.confidence,
                          x: Double(b.origin.x), y: Double(b.origin.y),
                          w: Double(b.size.width), h: Double(b.size.height)))
    }
}

let out = Out(image: (path as NSString).lastPathComponent, correct: useCorrection, lines: lines)
let enc = JSONEncoder()
enc.outputFormatting = [.prettyPrinted, .withoutEscapingSlashes]
let data = try enc.encode(out)
FileHandle.standardOutput.write(data)
FileHandle.standardOutput.write("\n".data(using: .utf8)!)
