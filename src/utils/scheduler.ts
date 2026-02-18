
import type { TeamDrawResult, Match, Fixture } from '../types';

/**
 * Generates matchdays (fixtures) from the draw results.
 * Since the draw generates an 8-regular graph, we decompose it into 8 perfect matchings.
 */
export const generateFixtures = (results: TeamDrawResult[]): Fixture[] => {
    // 1. Extract all unique matches (edges)
    const allMatches: Match[] = [];
    const processedPairs = new Set<string>();

    results.forEach(result => {
        const homeTeam = result.team;
        result.opponents.forEach(matchup => {
            if (matchup.isHome) {
                const awayTeam = matchup.opponent;
                // Use sorted IDs to ensure uniqueness regardless of direction
                const pairId = [homeTeam.id, awayTeam.id].sort((a, b) => a - b).join('-');

                if (!processedPairs.has(pairId)) {
                    allMatches.push({
                        id: pairId,
                        homeTeam: homeTeam,
                        awayTeam: awayTeam,
                        matchday: 0
                    });
                    processedPairs.add(pairId);
                }
            }
        });
    });

    if (allMatches.length !== 144) {
        console.warn(`Scheduler warning: Expected 144 matches, found ${allMatches.length}. Graph might not be 8-regular.`);
    }

    // 2. Schedule matches
    // Retry entire scheduling up to 10 times if we get stuck
    let schedule: Match[] = [];
    let success = false;

    for (let attempt = 0; attempt < 10; attempt++) {
        const result = trySchedule(allMatches, 36, 8);
        if (result) {
            schedule = result;
            success = true;
            break;
        }
        console.log(`Scheduling attempt ${attempt + 1} failed, retrying...`);
    }

    if (!success) {
        console.error("Failed to generate valid schedule after 10 attempts.");
        // Fallback: Assign matchdays round-robin or random just to show something
        schedule = allMatches.map((m, i) => ({
            ...m,
            matchday: (i % 8) + 1
        }));
    }

    // 3. Convert to Fixture objects & Sort
    const fixtures: Fixture[] = [];
    for (let i = 1; i <= 8; i++) {
        const matchesForDay = schedule.filter(m => m.matchday === i);
        fixtures.push({
            matchday: i,
            matches: matchesForDay
        });
    }

    return fixtures;
};

const trySchedule = (allMatches: Match[], numTeams: number, numRounds: number): Match[] | null => {
    // Deep copy matches to track remaining
    let remainingMatches = [...allMatches];
    const finalSchedule: Match[] = [];

    // For each round, find a perfect matching (set of edges covering all vertices)
    for (let round = 1; round <= numRounds; round++) {
        const roundMatches = findPerfectMatchingGreedy(remainingMatches, numTeams);

        if (!roundMatches) {
            return null; // Failed to find perfect matching for this round
        }

        // Assign round number
        roundMatches.forEach(m => {
            // Need to create new object to not mutate original if we retry upper loop
            finalSchedule.push({ ...m, matchday: round });

            // Remove from remaining
            remainingMatches = remainingMatches.filter(rm => rm.id !== m.id);
        });
    }

    return finalSchedule;
};

// Tries to find a perfect matching (size = numTeams/2) from available edges
const findPerfectMatchingGreedy = (edges: Match[], numTeams: number): Match[] | null => {
    // Retry this specific matching step multiple times
    // Because a bad random choice early on can block completion
    for (let tryCount = 0; tryCount < 50; tryCount++) {
        const shuffled = [...edges].sort(() => Math.random() - 0.5);
        const matching: Match[] = [];
        const usedTeams = new Set<number>();

        for (const match of shuffled) {
            if (!usedTeams.has(match.homeTeam.id) && !usedTeams.has(match.awayTeam.id)) {
                matching.push(match);
                usedTeams.add(match.homeTeam.id);
                usedTeams.add(match.awayTeam.id);
            }

            if (usedTeams.size === numTeams) {
                // Found perfect matching!
                return matching;
            }
        }

        // If we found a perfect matching (18 matches for 36 teams)
        if (matching.length === numTeams / 2) {
            return matching;
        }
    }

    return null;
};
