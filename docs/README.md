# GitHub Pages dashboard

This is a self-contained static HTML/CSS/JavaScript research dashboard.

## Publish
1. Merge this `docs/` folder into the root of `rahulkiran2222/llm-confidence-calibration` (do not delete existing project files).
2. Open repository **Settings → Pages**.
3. Set **Deploy from a branch**, branch `main`, folder `/docs`, then save.
4. GitHub Pages will publish at `https://rahulkiran2222.github.io/llm-confidence-calibration/`.

No build step, backend, Python runtime, API key, or model download is required.

## Data integrity
The page uses recorded aggregate results and confidence-bin summaries only. The retained aggregate JSON was reconstructed from notebook execution output and is not a substitute for the original row-level prediction CSV files. No question-level data is fabricated.
