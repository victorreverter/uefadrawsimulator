import type { Team, Matchup, TeamDrawResult } from '../types';
import { teams } from '../data/teams';

/**
 * Draw algorithm with pot balance - retries until valid
 * Each team must play 2 opponents from each pot (1 home, 1 away)
 */
export const simulateDraw = (): TeamDrawResult[] => {
    console.log('Starting draw simulation...');

    // Try up to 100 times to generate a valid draw
    for (let attempt = 1; attempt <= 100; attempt++) {
        const result = attemptDraw();

        if (result && validateDraw(result)) {
            console.log(`✅ Valid draw found on attempt ${attempt}`);
            return result;
        }

        if (attempt % 10 === 0) {
            console.log(`Attempt ${attempt}...`);
        }
    }

    console.error('Could not generate valid draw after 100 attempts');
    // Return the last attempt even if invalid
    return attemptDraw() || [];
};

/**
 * Attempt to generate a single draw
 */
const attemptDraw = (): TeamDrawResult[] | null => {
    const matchups = new Map<number, Matchup[]>();
    teams.forEach(t => matchups.set(t.id, []));

    // Shuffle teams for randomness
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);

    // Process each team to assign opponents pot by pot
    for (const team of shuffledTeams) {
        const current = matchups.get(team.id)!;

        // Skip if already has 8
        if (current.length >= 8) continue;

        // Calculate what we need from each pot
        const potNeeds = getPotNeeds(current);

        // For each pot, assign the needed opponents
        for (let pot = 1; pot <= 4; pot++) {
            const [homeNeeded, awayNeeded] = potNeeds.get(pot)!;

            if (homeNeeded === 0 && awayNeeded === 0) continue;

            // Find valid opponents from this pot
            const validFromPot = teams.filter(opp => {
                if (opp.pot !== pot) return false;
                if (opp.id === team.id) return false;
                if (opp.country === team.country) return false;

                const oppMatchups = matchups.get(opp.id)!;

                // Check opponent doesn't already have 8
                if (oppMatchups.length >= 8) return false;

                // Check not already playing each other
                if (oppMatchups.some(m => m.opponent.id === team.id)) return false;
                if (current.some(m => m.opponent.id === opp.id)) return false;

                // Check if opponent still needs matches from our pot
                const oppNeeds = getPotNeeds(oppMatchups);
                const oppNeedsFromOurPot = oppNeeds.get(team.pot)!;

                // If we want home, opponent must need away from our pot
                // If we want away, opponent must need home from our pot
                return oppNeedsFromOurPot[0] > 0 || oppNeedsFromOurPot[1] > 0;
            });

            // Shuffle for randomness
            const shuffled = validFromPot.sort(() => Math.random() - 0.5);

            // Assign home opponent if needed
            if (homeNeeded > 0) {
                // Find opponent that needs away from our pot
                const homeOpp = shuffled.find(opp => {
                    const oppNeeds = getPotNeeds(matchups.get(opp.id)!);
                    return oppNeeds.get(team.pot)![1] > 0; // Needs away from our pot
                });

                if (homeOpp) {
                    current.push({ opponent: homeOpp, isHome: true });
                    matchups.get(homeOpp.id)!.push({ opponent: team, isHome: false });
                }
            }

            // Assign away opponent if needed
            if (awayNeeded > 0) {
                // Find opponent that needs home from our pot (and not already assigned)
                const awayOpp = shuffled.find(opp => {
                    if (current.some(m => m.opponent.id === opp.id)) return false;
                    const oppNeeds = getPotNeeds(matchups.get(opp.id)!);
                    return oppNeeds.get(team.pot)![0] > 0; // Needs home from our pot
                });

                if (awayOpp) {
                    current.push({ opponent: awayOpp, isHome: false });
                    matchups.get(awayOpp.id)!.push({ opponent: team, isHome: true });
                }
            }
        }
    }

    // Build results
    const results: TeamDrawResult[] = teams.map(team => ({
        team,
        opponents: matchups.get(team.id)!,
    }));

    return results;
};

/**
 * Calculate how many opponents are needed from each pot
 * Returns [homeNeeded, awayNeeded] for each pot
 */
const getPotNeeds = (matchups: Matchup[]): Map<number, [number, number]> => {
    const needs = new Map<number, [number, number]>();

    // Initialize: need 1 home and 1 away from each pot
    [1, 2, 3, 4].forEach(pot => needs.set(pot, [1, 1]));

    // Subtract what we already have
    matchups.forEach(m => {
        const pot = m.opponent.pot;
        const current = needs.get(pot)!;
        if (m.isHome) {
            current[0] = Math.max(0, current[0] - 1);
        } else {
            current[1] = Math.max(0, current[1] - 1);
        }
    });

    return needs;
};

/**
 * Validate the draw meets all constraints
 */
export const validateDraw = (results: TeamDrawResult[]): boolean => {
    for (const result of results) {
        const { team, opponents } = result;

        // Must have 8 opponents
        if (opponents.length !== 8) {
            return false;
        }

        // Check home/away balance (4 home, 4 away)
        const homeCount = opponents.filter(m => m.isHome).length;
        const awayCount = opponents.filter(m => !m.isHome).length;
        if (homeCount !== 4 || awayCount !== 4) {
            return false;
        }

        // Check pot balance (2 from each pot: 1 home, 1 away)
        const potCounts = new Map<number, { home: number; away: number }>();
        [1, 2, 3, 4].forEach(pot => potCounts.set(pot, { home: 0, away: 0 }));

        opponents.forEach(m => {
            const pot = m.opponent.pot;
            const counts = potCounts.get(pot)!;
            if (m.isHome) {
                counts.home++;
            } else {
                counts.away++;
            }
        });

        for (const [pot, counts] of potCounts) {
            if (counts.home !== 1 || counts.away !== 1) {
                return false;
            }
        }

        // Check no same country
        for (const matchup of opponents) {
            if (team.country === matchup.opponent.country) {
                return false;
            }
        }
    }

    console.log('✅ Draw validation passed!');
    return true;
};
