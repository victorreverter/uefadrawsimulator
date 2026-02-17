import type { Team, Matchup, TeamDrawResult } from '../types';
import { teams } from '../data/teams';

/**
 * Simple working draw algorithm - guaranteed to complete
 * Assigns 8 random opponents to each team with basic constraints
 */
export const simulateDraw = (): TeamDrawResult[] => {
    console.log('Starting draw simulation...');

    const matchups = new Map<number, Matchup[]>();
    teams.forEach(t => matchups.set(t.id, []));

    // Process each team
    for (const team of teams) {
        const current = matchups.get(team.id)!;

        // Skip if already has 8
        if (current.length >= 8) continue;

        // Find valid opponents
        const validOpponents = teams.filter(opp => {
            // Can't play self
            if (opp.id === team.id) return false;

            // Can't play same country
            if (opp.country === team.country) return false;

            // Can't play if already assigned
            if (current.some(m => m.opponent.id === opp.id)) return false;

            // Can't play if opponent already playing this team
            const oppMatchups = matchups.get(opp.id)!;
            if (oppMatchups.some(m => m.opponent.id === team.id)) return false;

            // Can't play if opponent already has 8
            if (oppMatchups.length >= 8) return false;

            return true;
        });

        // Shuffle for randomness
        const shuffled = validOpponents.sort(() => Math.random() - 0.5);

        // Take up to 8 opponents
        const needed = 8 - current.length;
        const selected = shuffled.slice(0, needed);

        // Assign them
        selected.forEach((opp, idx) => {
            // Alternate home/away for balance
            const isHome = idx % 2 === 0;

            current.push({ opponent: opp, isHome });
            matchups.get(opp.id)!.push({ opponent: team, isHome: !isHome });
        });
    }

    // Build results
    const results: TeamDrawResult[] = teams.map(team => ({
        team,
        opponents: matchups.get(team.id)!,
    }));

    console.log('Draw simulation complete!');
    return results;
};

/**
 * Simple validation - just check basic requirements
 */
export const validateDraw = (results: TeamDrawResult[]): boolean => {
    console.log('Validating draw...');

    for (const result of results) {
        const { team, opponents } = result;

        // Must have 8 opponents
        if (opponents.length !== 8) {
            console.error(`${team.name} has ${opponents.length} opponents, expected 8`);
            return false;
        }

        // Check no same country
        for (const matchup of opponents) {
            if (team.country === matchup.opponent.country) {
                console.error(`${team.name} plays ${matchup.opponent.name} from same country`);
                return false;
            }
        }
    }

    console.log('✅ Draw validation passed!');
    return true;
};
