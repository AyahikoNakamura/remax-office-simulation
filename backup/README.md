# COMPASS データのバックアップ

COMPASS の入力データ（実績分析・登録エージェント・本部支払い設定・表示設定）は、
サーバやファイルではなく **ブラウザの localStorage** にだけ保存されている。
Chrome のプロフィール破損・サイトデータ削除・PC入替で消えると復旧手段がないため、
定期的にこのフォルダへ書き出しておく。

## 保存されているデータ

| キー | 内容 |
|---|---|
| `remaxActualSalesRows` | 実績分析（売上CSVの取込結果） |
| `remaxRegisteredAgents` | 登録エージェント |
| `remaxHeadOfficePaymentSettings` | 本部支払い設定 |
| `remaxSeminarMode` / `remaxSeminarFontPx` | セミナー表示のON/OFF・文字サイズ |

保存先オリジンは **`http://localhost:8770`**。file:// で開いた場合は別の保管庫になり、
このデータは見えない（詳細は `../player`／プレーヤー側 index.html のコメント参照）。

## バックアップの取り方

1. COMPASS のサーバを起動（デスクトップの「REMAX COMPASS」または「RE-MAX 説明会プレイヤー 0728旭川」）
2. ブラウザで <http://localhost:8770/backup/restore.html> を開く
3. **「今の状態をバックアップとして保存（ダウンロード）」** を押す
4. ダウンロードされた `YYYY-MM-DD_compass_localstorage.json` をこのフォルダへ移動

## 復元の仕方

1. 同じく <http://localhost:8770/backup/restore.html> を開く
2. 「バックアップから復元する」でこのフォルダの JSON を選ぶ
3. 内容（件数）を確認して **「選んだファイルの内容で復元する」** を押す
4. COMPASS を開き直す

> 復元は**上書き**。実行前に、現在の状態も一度ダウンロードしておくこと。

## 注意：中身は実データ

バックアップ JSON には実在のエージェント名・物件名・入金額が入っている。
そのため `backup/*.json` は `.gitignore` で **Git 追跡から除外**してある（GitHubには上がらない）。
このフォルダごと外付けやクラウドへ複製する場合は、取り扱いに注意する。

## 履歴

| ファイル | 時点 | 中身 |
|---|---|---|
| `2026-07-29_compass_localstorage.json` | 2026-07-29 | 実績 494件（2024-01〜2026-05・18名分）／登録エージェント 12名 |
