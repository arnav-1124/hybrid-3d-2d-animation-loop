// The one exercise rig — identical bar geometry in every panel so the test
// stays fair. Bar-space: the bar line sits at y=BAR_Y, the floor at y=0; all
// pull-up poses are authored in this same local space (see characters/hang.ts).
export const BAR_Y = 2.72; // bar height
// The bar sits just behind the body plane: at the top of a rep the bar line
// passes BEHIND the head — that's what makes "chin over the bar" read.
export const BAR_Z = -0.08;
export const BAR_HALF = 3.2; // half length — spans ~72% of a panel's width
