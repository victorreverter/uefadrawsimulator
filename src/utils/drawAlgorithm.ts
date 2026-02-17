import type { Team, Matchup, TeamDrawResult } from '../types';
import { teams } from '../data/teams';

/**
 * Simplified draw algorithm - processes teams and assigns valid opponents
 */
export const simulateDraw = (): TeamDrawResult[] => {
    console.log('Starting draw simulation...');

    // Initialize matchups for all teams
    const teamMatchups = new Map<number, Matchup[]>();
    teams.forEach(team => teamMatchups.set(team.id, []));

    // Process each team to assign 8 opponents
    for (const team of teams) {
        const currentMatchups = teamMatchups.get(team.id)!;

        // Skip if already has 8 opponents
        if (currentMatchups.length >= 8) continue;

        // Find valid opponents with proper home/away assignment
        const needed = 8 - currentMatchups.length;
        const validOpponents = findValidOpponents(team, teamMatchups);

        // Take the first 'needed' opponents
        const selected = validOpponents.slice(0, needed);

        // Assign them
        for (const { opponent, isHome } of selected) {
            // Add to current team
            currentMatchups.push({ opponent, isHome });

            // Add reciprocal to opponent
            const opponentMatchups = teamMatchups.get(opponent.id)!;
            opponentMatchups.push({ opponent: team, isHome: !isHome });
        }
    }

    // Convert to results
    const results: TeamDrawResult[] = teams.map(team => ({
        team,
        opponents: teamMatchups.get(team.id)!,
    }));

    console.log('Draw simulation complete!');
    return results;
};

/**
 * Find all valid opponents for a team with correct home/away assignment
 */
const findValidOpponents = (
    team: Team,
    allMatchups: Map<number, Matchup[]>
): Array<{ opponent: Team; isHome: boolean }> => {
    const currentMatchups = allMatchups.get(team.id)!;
    const assignedIds = new Set(currentMatchups.map(m => m.opponent.id));

    // Calculate current state for this team
    const potCounts = new Map<number, [number, number]>();
    const countryCounts = new Map<string, number>();
    [1, 2, 3, 4].forEach(pot => potCounts.set(pot, [0, 0]));

    currentMatchups.forEach(m => {
        const pot = m.opponent.pot;
        const counts = potCounts.get(pot)!;
        counts[m.isHome ? 0 : 1]++;

        const country = m.opponent.country;
        countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    });

    const validOpponents: Array<{ opponent: Team; isHome: boolean }> = [];

    for (const opponent of teams) {
        // Skip self
        if (opponent.id === team.id) continue;

        // Skip if already assigned
        if (assignedIds.has(opponent.id)) continue;

        // Skip same country
        if (team.country === opponent.country) continue;

        // Check if opponent already has 8
        const opponentMatchups = allMatchups.get(opponent.id)!;
        if (opponentMatchups.length >= 8) continue;

        // Check if already playing each other
        const alreadyPlaying = opponentMatchups.some(m => m.opponent.id === team.id);
        if (alreadyPlaying) continue;

        // Check association limit for this team
        const countryCount = countryCounts.get(opponent.country) || 0;
        if (countryCount >= 2) continue;

        // Check pot balance for this team
        const potCount = potCounts.get(opponent.pot)!;
        const totalFromPot = potCount[0] + potCount[1];
        if (totalFromPot >= 2) continue;

        // Calculate opponent's current state
        const opponentPotCounts = new Map<number, [number, number]>();
        const opponentCountryCounts = new Map<string, number>();
        [1, 2, 3, 4].forEach(pot => opponentPotCounts.set(pot, [0, 0]));

        opponentMatchups.forEach(m => {
            const pot = m.opponent.pot;
            const counts = opponentPotCounts.get(pot)!;
            counts[m.isHome ? 0 : 1]++;

            const country = m.opponent.country;
            opponentCountryCounts.set(country, (opponentCountryCounts.get(country) || 0) + 1);
        });

        // Check opponent's country limit
        const opponentCountryCount = opponentCountryCounts.get(team.country) || 0;
        if (opponentCountryCount >= 2) continue;

        // Check opponent's pot balance
        const opponentPotCount = opponentPotCounts.get(team.pot)!;
        const opponentTotalFromPot = opponentPotCount[0] + opponentPotCount[1];
        if (opponentTotalFromPot >= 2) continue;

        // NOW determine home/away - this is the critical fix
        // We need to find a home/away assignment that works for BOTH teams
        const teamHomeCount = potCount[0];
        const teamAwayCount = potCount[1];
        const opponentHomeCount = opponentPotCount[0];
        const opponentAwayCount = opponentPotCount[1];

        let isHome: boolean | null = null;

        // If team needs home from this pot and opponent needs away from team's pot
        if (teamHomeCount < 1 && opponentAwayCount < 1) {
            isHome = true;
        }
        // If team needs away from this pot and opponent needs home from team's pot
        else if (teamAwayCount < 1 && opponentHomeCount < 1) {
            isHome = false;
        }
        // If only one option works for team
        else if (teamHomeCount >= 1 && teamAwayCount < 1) {
            // Team must play away
            if (opponentHomeCount < 1) {
                isHome = false;
            } else {
                continue; // Can't match
            }
        }
        else if (teamAwayCount >= 1 && teamHomeCount < 1) {
            // Team must play home
            if (opponentAwayCount < 1) {
                isHome = true;
            } else {
                continue; // Can't match
            }
        }
        // Both teams have flexibility, prefer balance
        else {
            const totalTeamHome = Array.from(potCounts.values()).reduce((sum, c) => sum + c[0], 0);
            const totalTeamAway = Array.from(potCounts.values()).reduce((sum, c) => sum + c[1], 0);
            const totalOpponentHome = Array.from(opponentPotCounts.values()).reduce((sum, c) => sum + c[0], 0);
            const totalOpponentAway = Array.from(opponentPotCounts.values()).reduce((sum, c) => sum + c[1], 0);

            // Prefer home if team has fewer home games and opponent has fewer away games
            if (totalTeamHome < totalTeamAway && totalOpponentAway < totalOpponentHome) {
                isHome = true;
            } else if (totalTeamAway < totalTeamHome && totalOpponentHome < totalOpponentAway) {
                isHome = false;
            } else {
                // Default: prefer home if team has fewer or equal home games
                isHome = totalTeamHome <= totalTeamAway;
                // But check if opponent can accept the reciprocal
                if (isHome && opponentAwayCount >= 1) {
                    isHome = false;
                } else if (!isHome && opponentHomeCount >= 1) {
                    isHome = true;
                }
            }
        }

        if (isHome !== null) {
            validOpponents.push({ opponent, isHome });
        }
    }

    return validOpponents;
};

/**
 * Validate that the complete draw meets all constraints
 */
export const validateDraw = (results: TeamDrawResult[]): boolean => {
    console.log('Validating draw...');

    for (const result of results) {
        const { team, opponents } = result;

        // Check opponent count
        if (opponents.length !== 8) {
            console.error(`${team.name} has ${opponents.length} opponents, expected 8`);
            return false;
        }

        // Check home/away balance
        const homeCount = opponents.filter(m => m.isHome).length;
        const awayCount = opponents.filter(m => !m.isHome).length;
        if (homeCount !== 4 || awayCount !== 4) {
            console.error(`${team.name} has ${homeCount} home and ${awayCount} away games`);
            return false;
        }

        // Check pot balance
        const potCounts = new Map<number, { home: number; away: number }>();
        [1, 2, 3, 4].forEach(pot => {
            potCounts.set(pot, { home: 0, away: 0 });
        });

        opponents.forEach(matchup => {
            const pot = matchup.opponent.pot;
            const counts = potCounts.get(pot)!;
            if (matchup.isHome) {
                counts.home++;
            } else {
                counts.away++;
            }
        });

        for (const [pot, counts] of potCounts) {
            if (counts.home !== 1 || counts.away !== 1) {
                console.error(`${team.name} has ${counts.home} home and ${counts.away} away from pot ${pot}`);
                return false;
            }
        }

        // Check country protection
        for (const matchup of opponents) {
            if (team.country === matchup.opponent.country) {
                console.error(`${team.name} plays ${matchup.opponent.name} from same country`);
                return false;
            }
        }

        // Check association limit
        const countryCounts = new Map<string, number>();
        opponents.forEach(matchup => {
            const country = matchup.opponent.country;
            countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
        });

        for (const [country, count] of countryCounts) {
            if (count > 2) {
                console.error(`${team.name} plays ${count} teams from ${country}`);
                return false;
            }
        }
    }

    console.log('Draw validation passed!');
    return true;
};
