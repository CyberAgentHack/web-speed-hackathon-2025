/**
 * 指定された時間とビデオトラックIDに基づいてビデオセグメントを取得するユーティリティ関数
 */
export const fetchSegment = async (
  time: number,
  videoTrackId: number,
): Promise<{ binary: ArrayBuffer; id: string }> => {
  try {
    // 最も近いセグメントのURLを計算
    const segmentNumber = Math.floor(time / 10); // 例: 10秒ごとのセグメント
    const segmentUrl = `/streams/tracks/${videoTrackId}/segments/${segmentNumber}.mp4`;
    
    // セグメントをフェッチ
    const response = await fetch(segmentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch segment: ${response.statusText}`);
    }
    
    // レスポンスをバイナリデータとして取得
    const binary = await response.arrayBuffer();
    
    // ユニークなIDを生成
    const id = `segment-${videoTrackId}-${segmentNumber}-${Math.random().toString(36).substring(2, 9)}`;
    
    return { binary, id };
  } catch (error) {
    console.error('Error fetching segment:', error);
    // エラー時には空のセグメントを返す
    return { binary: new ArrayBuffer(0), id: `error-${Math.random().toString(36).substring(2, 9)}` };
  }
}; 