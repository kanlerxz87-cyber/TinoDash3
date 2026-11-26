# Interactive staged-cash yield sensitivity — recheck (26 Nov 2026)

## Scope and source

- Rechecked the official U.S. Treasury November 2026 Daily Treasury Par Yield Curve. The **25 Nov 2026** row reports **3-month 4.34%** and **2-year 4.61%**. These are dated par-yield observations, not forecasts or guaranteed future cash returns. [Official Treasury table](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202611).
- The **2.00%** case is a deliberately chosen stress input, not an official rate or forecast.
- No household inputs, property values, locations, or private files were read or added.

## Interactive model behavior

- `paths.html` now has a staged-sale cash-yield selector. Its default preserves the existing designed Treasury-rate sequence. Alternative settings use either a **fixed 4.34% 3-month snapshot proxy** or a **fixed 2.00% stress**.
- The fixed-rate choice applies only to sale proceeds while cash awaits equity purchases (including the selected ladder and 12-month entry). Rental cash and owner-carry cash continue to use the designed scenario Treasury rates. The 2-year 4.61% figure is displayed as context and is **not** applied as a simulated 3M–2Y ladder schedule. Fixed yields are nominal; tax on Treasury interest is not modeled.
- The eight-path ranking, range table, selected-sequence staging table, chart, and robustness results rerun on control changes. A separate always-visible comparison reruns the same selected scenario and horizon at 4.34% and 2.00%, and reports both the overall leader and the selected staged path's rank/value.
- Neither fixed rate is extrapolated as a 2040–2050 forecast. The economic sequences are designed stress conventions, not historical return replays or probability-weighted forecasts. The interactive model in `assets/engine.js` remains distinct from the static Black Swan model in `assets/figures.js` (F-27); their results are not directly comparable.

## Rebuilt ranking results

All values below are normalized multiples per 1.00 starting unit, for a 30-month ladder and 12-month equity phase-in. They are model outputs, not household estimates.

| Designed sequence / horizon | 4.34% leader | Staged path at 4.34% | 2.00% leader | Staged path at 2.00% | Overall leader moved? |
| --- | --- | ---: | --- | ---: | --- |
| Irregular baseline / 10 years (page default) | Rent 5y → sell → staged | rank 6; 1.2439 | Rent 5y → sell → staged | rank 7; 1.1633 | No; staged path falls one rank |
| 2007–2009-style designed shock / 10 years | Sell → 3M–2Y ladder → phase in | rank 1; 1.4810 | Sell → 12-month equity entry | rank 2; 1.3850 | **Yes** |

Across the full 4-scenario × 4-horizon grid (16 cells), the overall leader changes in **3 cells**: the designed 2007–2009-style shock at **5, 10, and 50 years**. The staged path's ending multiple is lower at 2.00% in all 16 cells; its rank falls in 9 cells. In the 1929-style and stagflation designs, the selected 2.00% cash stress does not change the overall leader. These counts are unweighted design-case comparisons, not probabilities or a household recommendation.

## Verification

- After rebasing onto `bc932c8` on 26 Nov 2026, `npm test` passed: privacy scan clean across 35 text files; static check passed for 16 pages; all 28 Node test entries passed (22 engine tests, 1 figures-test wrapper, and 5 render tests). The 12 figure assertions passed; private household checks were skipped because `private/` is absent. `git diff --check` also passed.
- Engine tests pin the official date/rates, the baseline no-leader-change case, the 2007–2009-style 10-year leader change, the staged-value decrease, and the unaffected immediate-equity path. Render tests change the live selector from the 4.34% proxy to the 2.00% stress and verify the leader and displayed rank update.
- Render tests exercise the actual `paths.html`/`assets/model.js` wiring, change the yield control, and verify the ranked table and leader-movement message update.
