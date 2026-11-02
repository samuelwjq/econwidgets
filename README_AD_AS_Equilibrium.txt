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
