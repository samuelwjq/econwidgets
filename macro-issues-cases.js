/* Presets use the qualitative diagram coordinates from AD–AS Equilibrium. */
window.MacroIssuesCases = [
  { category: 'Actual Growth', cases: [
    {
      title: 'AD increases', initial: 52, shift: {ad: 20},
      explanation: 'Higher consumption → AD increases → firms use idle resources to raise RNY at the same GPL.',
      equilibria: [
        {label: 'Spare Capacity', initial: 52},
        {label: 'Near Capacity', initial: 140, explanation: 'Higher consumption → AD increases → RNY rises slightly and GPL rises as firms approach the capacity limit.'}
      ]
    },
    {
      title: 'SRAS increases', initial: 112, shift: {costs: -16},
      explanation: 'Lower energy costs → SRAS increases → RNY rises and GPL falls. Productive capacity stays fixed.',
      equilibria: [
        {label: 'Spare Capacity', initial: 60},
        {label: 'Near Capacity', initial: 112}
      ]
    },
  ] },
  { category: 'Potential Growth', cases: [
    {
      title: 'LRAS increases', initial: 66, shift: {capacity: 24},
      explanation: 'Better infrastructure → LRAS increases → productive capacity rises. AD still intersects the same horizontal section, so actual RNY and GPL stay unchanged.',
      equilibria: [
        {label: 'Spare Capacity', initial: 66},
        {label: 'At Capacity', initial: 155, explanation: 'Better infrastructure → LRAS increases → productive capacity rises. The expansion eases the capacity constraint, so actual RNY also rises and GPL falls.'},
        {label: 'Near Capacity', initial: 112, explanation: 'Higher productive capacity shifts LRAS right. RNY rises and GPL falls as capacity constraints ease.'}
      ]
    },
  ] },
  { category: 'Sustained Growth', cases: [
    {
      title: 'AD and LRAS increase', initial: 148,
      shift: {ad: 24, capacity: 24},
      explanation: 'Higher spending raises AD, while expanding productive capacity shifts LRAS to the right. Actual and potential output both rise. Sustained growth requires these gains to continue over time.',
      equilibria: [
        {label: 'Spare Capacity', initial: 58},
        {label: 'Near Capacity', initial: 148},
        {label: 'At Capacity', initial: 165}
      ]
    }
  ] },
  { category: 'Negative Growth', cases: [
    {
      title: 'AD decreases', initial: 78, shift: {ad: -27},
      explanation: 'Lower consumer confidence → consumption and AD fall → RNY falls. With spare capacity, GPL stays unchanged in this preset.',
      equilibria: [
        {label: 'Spare Capacity', initial: 78},
        {label: 'Near Capacity', initial: 136, explanation: 'Lower consumer confidence → consumption and AD fall → both RNY and GPL fall. Productive capacity stays fixed.'},
        {label: 'At Capacity', initial: 165, explanation: 'Lower AD first reduces GPL while output stays at capacity. If AD falls far enough, RNY also falls.'}
      ]
    },
    {
      title: 'SRAS decreases', initial: 112, shift: {costs: 17},
      explanation: 'Higher production costs → SRAS decreases → RNY falls and GPL rises. Productive capacity stays unchanged.',
      equilibria: [
        {label: 'Spare Capacity', initial: 65},
        {label: 'Near Capacity', initial: 112}
      ]
    },
    {
      title: 'LRAS decreases', initial: 155, shift: {capacity: -14},
      explanation: 'A loss of productive resources → LRAS decreases → productive capacity falls. The economy starts at capacity, so actual RNY also falls and GPL rises.',
      equilibria: [
        {label: 'Near Capacity', initial: 130, explanation: 'A loss of productive resources shifts LRAS left. Productive capacity and actual RNY fall, while GPL rises.'},
        {label: 'At Capacity', initial: 155}
      ]
    }
  ] },
  { category: 'Inflation', cases: [
    {
      title: 'Demand-pull (AD increases)', target: 'Demand-Pull Inflation', initial: 140, shift: {ad: 22},
      explanation: 'Higher spending → AD increases → GPL rises. With little spare capacity, RNY rises only slightly.',
      equilibria: [
        {label: 'Near Capacity', initial: 140},
        {label: 'At Capacity', initial: 165, explanation: 'Higher spending → AD increases → GPL rises. RNY is already at productive capacity and stays unchanged.'},
        {label: 'Spare Capacity', initial: 68, explanation: 'Higher AD first raises RNY at the same GPL. If the shift reaches the upward-sloping portion of AS, GPL also rises.'}
      ]
    },
    {
      title: 'Cost-push (SRAS decreases)', target: 'Cost-Push Inflation', initial: 112, shift: {costs: 17},
      explanation: 'Higher energy costs → SRAS decreases → GPL rises and RNY falls.',
      note: 'If inflation persists alongside weak output and high unemployment, the economy can experience stagflation.',
      equilibria: [
        {label: 'Spare Capacity', initial: 65},
        {label: 'Near Capacity', initial: 112}
      ]
    }
  ] },
  { category: 'Deflation', cases: [
    {
      title: 'AD decreases', initial: 127, shift: {ad: -31},
      explanation: 'Lower consumption and investment → AD decreases → both GPL and RNY fall.',
      equilibria: [
        {label: 'Spare Capacity', initial: 78, explanation: 'Lower AD reduces RNY. GPL stays unchanged because the economy remains on the flat portion of AS.'},
        {label: 'Near Capacity', initial: 127},
        {label: 'At Capacity', initial: 165, explanation: 'Lower AD reduces GPL. RNY stays at capacity until AD falls enough to move the equilibrium below capacity.'}
      ]
    },
    {
      title: 'SRAS increases', initial: 112, shift: {costs: -16},
      explanation: 'Lower production costs → SRAS increases → GPL falls and RNY rises.',
      equilibria: [
        {label: 'Spare Capacity', initial: 60},
        {label: 'Near Capacity', initial: 112}
      ]
    },
    {
      title: 'LRAS increases', initial: 170, shift: {capacity: 24},
      explanation: 'Higher productive capacity → LRAS increases → GPL falls and RNY rises at the same AD.',
      equilibria: [
        {label: 'Near Capacity', initial: 130},
        {label: 'At Capacity', initial: 170}
      ]
    }
  ] },
  { category: 'Unemployment', cases: [
    {
      title: 'Demand-deficient (AD decreases)', target: 'Demand-Deficient Unemployment', initial: 78, shift: {ad: -24}, outputGap: true,
      explanation: 'Lower investment → AD decreases → RNY falls further below productive capacity. Firms need fewer workers, so demand-deficient unemployment rises.',
      equilibria: [
        {label: 'Spare Capacity', initial: 78},
        {label: 'At Capacity', initial: 165, explanation: 'A small fall in AD leaves RNY at capacity. A large enough fall takes RNY below capacity, opening a negative output gap and increasing demand-deficient unemployment.'},
        {label: 'Near Capacity', initial: 136}
      ]
    }
  ] }
];
