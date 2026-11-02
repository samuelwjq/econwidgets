AGGREGATE DEMAND FACTORS

Open Aggregate_Demand_Factors.html. Keep all HTML, JS and CSS files together.
Upload the 11 web files to the existing repository root. README is optional.
The existing index.html is not included or changed. Open this widget directly
until you choose to add its link to the index.

FEATURES
- Separate C, I, G, X and M choices; qualitative increases and decreases.
- X/M summaries explicitly identify the effect on net exports (X - M).
- Movement Along AD mode changes the general price level while AD stays fixed.
- AS hidden initially; optional smooth Keynesian AS with a horizontal section,
  an upward-sloping section, and a vertical full-employment section.
- AS steepness and full-employment controls appear only when AS is shown.
- AD initially intersects the upward-sloping AS section.
- Initial and current equilibria appear in component-change mode with AS shown.
- Movement-mode points are positions on AD, not equilibrium claims.
- Tooltips, collapsible glossary, summary and explanation panels, fullscreen,
  reset, copy, PNG/SVG and grayscale exports use the existing shared interface.
- No multiplier rounds; illustrative geometry, not a numerical forecast.

ARCHITECTURE
aggregate-demand-model.js contains the economic relationships.
Aggregate_Demand_Factors.js contains state, drawing and presentation hooks.
aggregate-demand.css contains model-specific layout extensions.
The 7 shared files are byte-identical to the supplied latest widget package.
Glossary definitions follow the existing local HTML arrangement.
No frameworks, external services or network fetches are needed.

VALIDATION
- JavaScript syntax and local script/stylesheet references checked.
- 7,137 model states checked for equilibrium consistency and output bounds.
- Browser UI verified for all five component choices, both directions, and
  net-export direction; movement mode; AS controls; reset; tooltip pin/close.
- Laptop layout and 768px/390px iframe layouts inspected. Narrow axis-title
  bounds checked after corrections. Physical touch devices were not tested.
- Colour and grayscale PNG downloads completed in the browser.
- Fullscreen entry/exit and state retention exercised using the in-window
  fallback. Native browser fullscreen activation was unavailable here.
- Copy reported the shared interface's download fallback in this embedded
  browser; successful native clipboard access is not certified.
- Exhaustive browser testing of every control combination was not performed.
