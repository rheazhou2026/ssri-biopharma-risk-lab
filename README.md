# SSRI Lab — Biopharma Alliance Fragility Explorer

An interactive, dependency-free research visualization built from **Rhea Zhou, “Quantifying Biopharma Alliance Fragility Using a Strategic Shock Risk Index (SSRI),” IEEE International Conference on Data Mining Workshops (ICDMW), 2025**. [DOI: 10.1109/ICDMW69685.2025.00398](https://doi.org/10.1109/ICDMW69685.2025.00398).

**[Launch the live SSRI Lab](https://rheazhou2026.github.io/ssri-biopharma-risk-lab/)**

## What you can explore

- **Interactive scenario calculator:** adjust relative alliance duration, deal size, prior terminations, concurrent alliances, clinical phase, strategic fit, unilateral termination rights, and VC involvement.
- **Published coefficient decomposition:** see the contributions of every linear, quadratic, and interaction term in the published final SSRI formula (Eq. 5).
- **Dependency and buffer indices:** derived from the PCA-weighted expressions in the paper (Eqs. 2–3).
- **Nonlinear interaction heatmap:** examine the modeled duration–dependency interaction while holding other terms fixed.
- **Counterfactual stress tests:** compare hypothetical changes to contract and diversification variables.
- **Export:** download your scenario and coefficient contributions as CSV.

## Source and scientific caveats

The paper's original 20-alliance training dataset, feature-specific min–max bounds, standardization parameters, and saved fitted model pipeline were **not provided**. Accordingly:

1. This project implements the *reported coefficients* but uses explicitly **illustrative normalized 0–1 control values**, not reconstructed real company-level inputs.
2. The published PCA weight formulas are scaled by the sums of their stated positive weights so that their illustrative component indices remain in 0–1; the exact original index preprocessing cannot be recovered from the paper alone.
3. The interface reports a **raw, unitless regression output**, not a probability of dissolution, a percent stock move, or a validated prediction for a particular company. Outputs can be below zero or above one.
4. Paper-reported metrics (R² ≈ 0.82, AUC = 0.96, n = 20 in the original study) are shown for context and **are not reproduced or independently validated here**. The paper notes an expanded 200+ alliance dataset, but these records are not bundled here.
5. **Clinical phase**, **strategic fit**, and **market overlap** have specific paper codings. The final published coefficient expression does not directly feature market overlap; it is therefore not an editable direct model term in this visualization. VC involvement and strategic fit enter through sub-indices rather than standalone final regression terms.
6. The experiment studies market-shock severity *conditional on announced termination*, not termination likelihood.

This project uses no proprietary source data and is not financial or investment advice.

## Run locally

Double-click `index.html`. No server, package install, API key, or build step required. For local development, optionally run `python3 -m http.server 8000` and open `http://localhost:8000`.

## Deploy on GitHub Pages

Create a **public** repository named `ssri-biopharma-risk-lab`, upload all files to its root on `main`, then choose **Settings → Pages → Deploy from a branch → main → / (root) → Save**. The live page will be `https://rheazhou2026.github.io/ssri-biopharma-risk-lab/` once deployment completes.

## Research citation

Zhou, R. (2025). *Quantifying Biopharma Alliance Fragility Using a Strategic Shock Risk Index (SSRI).* 2025 IEEE International Conference on Data Mining Workshops. DOI: 10.1109/ICDMW69685.2025.00398.

## Project structure

- `index.html` — complete single-page interface
- `styles.css` — responsive design
- `model.js` — pure SSRI regression and sub-index calculations
- `script.js` — interactive controls, visualizations, CSV export
- `tests/model.test.js` — numerical consistency tests
