AD-AS EQUILIBRIUM

Extract all files into the same repository-root directory as the existing widgets.
Open AD_AS_Equilibrium.html. No build or installation is required.
The Index is not included or modified.
Shared resources are byte-identical to those in the current AS Factors package.

CONTROLS
Initial equilibrium: horizontal SRAS, intermediate section or vertical LRAS.
Changing this selection resets AD and AS shocks.
All four sliders remain visible, arranged in two rows:
AD row: Initial AD Change (Decrease / 0 / Increase), Size of Multiplier
(Zero / Large, with no numerical multiplier displayed).
The AD slider represents initial autonomous spending before the multiplier.
Zero on either AD or multiplier slider gives no AD shift.
AS row: Cost of Production (COP), Productive Capacity. Both use
Decrease / 0 / Increase and start at zero.
Higher COP decreases SRAS (upwards shift); lower COP increases SRAS
(downwards shift). Productive capacity changes LRAS right/left.
Both supply controls can be adjusted independently at the same time.
E0/E1 labels are centred vertically above their own points; when clustered,
labels stack upwards without moving sideways or covering the intersections.
The multiplier remains a qualitative teaching scale, not a numerical estimate.

PRESENTATION
Initial and new curves, E0/E1, P0/P1 and Y0/Y1; always-visible coordinate guides;
red shift arrows; summary strip; glossary; explanations; tooltips; reset;
fullscreen; colour/grayscale PNG and SVG exports; clipboard-copy control.
Curve labels are placed clear of curve lines. Original curves remain fixed.
Summary strip uses the suite standard: 28px normally, 40px at <=480px.

VALIDATION
JavaScript syntax and local-resource checks passed.
22,500 model scenarios checked: valid plot bounds, AD-AS intersections,
zero spending/multiplier, direction of AD effects and isolated supply controls.
Browser checks: all initial sections, AD increases/decreases, zero multiplier,
small simultaneous shifts and dense labels, combined AD/AS shifts, tooltips,
reset, fullscreen fallback, successful colour/grayscale PNG exports.
Responsive checks: desktop, 768px tablet iframe and 390px phone iframe.
No horizontal overflow or unresolved curve-label placement in sampled states.
Native browser fullscreen, physical touch and successful clipboard copying
have not been verified. SVG export uses the existing shared suite helper.

CONTROL-REVISION CHECKS
Browser verified: all four sliders always visible; positive COP decreases
SRAS; zero multiplier leaves supply changes active; initial-case changes
and Reset restore neutral shocks; E labels remain centred above points
in all three initial sections, including small shifts and phone width.
Phone width check passed without horizontal overflow.

ARROW AND LABEL REVISION
Diagram Options has independent AD Shift Arrow and AS Shift Arrow toggles.
Both start off and Reset switches them off. Neither appears for zero shift.
SRAS-only arrows are vertical; LRAS-only arrows are horizontal near the top.
Reinforcing cost/capacity changes use a 45-degree arrow with endpoints on AS.
Opposing cost/capacity effects use a top horizontal arrow between the vertical
sections, where productive-capacity changes are unambiguous.
AD labels follow AD Factors' preferred positions, with collision clearance
from every curve. Summary strips write Unchanged instead of sideways arrows.

REVISION VALIDATION
1,680 AS arrow geometries passed endpoint-on-curve and direction checks.
Browser verified separate toggles, defaults, reset, vertical and top-horizontal
arrows, the 45-degree combined arrow, and phone Unchanged summary fit.

LATEST ARROW REVISION
The previous independent arrow options are replaced by one Show Shifts in
AD/AS checkbox, off by default and after Reset. Any capacity change uses a
horizontal arrow between vertical AS sections near the top; pure COP changes
use a vertical arrow between horizontal sections. This supersedes earlier
arrow descriptions. Label behaviour is unchanged pending user review.
Syntax and 25 source-level arrow-placement cases passed for this revision;
this latest revision has not had a visual browser check.

SHARED LABEL PLACEMENT REVISION
Curve and equilibrium labels now use EconDiagramPresentation.layoutSvg,
the shared D&S layout engine. The nonlinear AS is registered as sampled
curve segments, with its horizontal or vertical section used for proximity.
AD labels use right-endpoint anchors and the shared parallel-family rules.
E labels are free to move sideways; their above-point constraint and custom
stacking routine are removed. E0 is dark and E1 blue, matching D&S.
Shared collision rules protect curves, labels and equilibrium markers;
displaced equilibrium labels use grey leaders. All shared files are unchanged.
Browser checks passed for three initial sections with simultaneous shocks
and a dense 390px phone iframe scenario; no shared-layout errors reported.
Earlier custom-label descriptions are superseded by this revision.

LATEST REVISION
Paired labels use outside-only candidate positions near the same curve end.
Shift arrows are registered as label obstacles. Expanded AD, COP and capacity
effects; horizontal starting equilibrium adjusted to keep extremes on plot.
Show Multiplier Effect defaults off and adds four purple AD curves at
progressively smaller remaining distances from the final AD curve. These
represent illustrative cumulative spending rounds, not calibrated values.
Control-panel multiplier statement removed. Syntax and extreme model bounds
checked; this revision still needs visual browser verification.

LATEST RANGE AND LABEL REVISION
AD response increased to 50, COP to 18, capacity to 30 internal units.
Price plotting range increased to keep extreme equilibria visible.
Extreme negative AD shocks saturate at positive output instead of extending
into negative income. Purple rounds capped at three with spacing thresholds,
labelled AD_a, AD_b, AD_c using Unicode subscripts. Point-label candidates
are restricted to centres closer to their own equilibrium than the other.
Sampled browser checks covered intermediate labels and expanded extremes.

INTERMEDIATE CURVE COUNT REVISION
With nonzero AD change and Show Multiplier Effect enabled, two purple
intermediate curves always appear; a third is added at sufficient spacing.
The lines are thinner and lighter than AD0/AD1. Their labels have staggered
preferred anchors along the lines. At zero shift, no duplicate curves appear.
Syntax and source checks passed; visual browser verification remains pending.

MULTIPLIER REVISION
No Further Rounds retains the initial spending shift. AD_a stays fixed when
only multiplier changes. Later stages add fractions of induced spending.
At No Further Rounds only AD1 represents the initial-only effect.
Axes use GPL/RNY. Source and model checks passed; browser QA pending.
