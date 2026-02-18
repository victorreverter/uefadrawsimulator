
import type { TeamDrawResult, Match, Fixture } from '../types';

/**
 * Generates matchdays using a Recursive Backtracking approach to decompose 
 * the 8-regular graph into 8 perfect matchings.
 */
export const generateFixtures = (results: TeamDrawResult[]): Fixture[] => {
    // 1. Extract all unique matches
    const allMatches: Match[] = [];
    const processedPairs = new Set<string>();

    results.forEach(result => {
        const homeTeam = result.team;
        result.opponents.forEach(matchup => {
            if (matchup.isHome) {
                const awayTeam = matchup.opponent;
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
        console.warn(`Scheduler: Expected 144 matches, found ${allMatches.length}.`);
    }

    // 2. solve using backtracking
    // We try to find 8 disjoint perfect matchings
    const schedule = solveBacktracking(allMatches, 8);

    // 3. Convert to Fixtures
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

/**
 * Recursive solver to find 'numRounds' perfect matchings
 */
const solveBacktracking = (edges: Match[], numRounds: number): Match[] => {
    // Try up to 10 restarts of the whole process
    for (let attempt = 0; attempt < 10; attempt++) {
        const result = recursiveStep(edges, 1, numRounds);
        if (result) return result;
        console.log(`Scheduler attempt ${attempt + 1} failed, retrying...`);
    }

    // Fallback: Just distribute round-robin if we really fail
    console.error("Scheduler failed to find valid edge coloring.");
    return edges.map((m, i) => ({
        ...m,
        matchday: (i % numRounds) + 1
    }));
};

const recursiveStep = (currentEdges: Match[], round: number, totalRounds: number): Match[] | null => {
    // Base case: All rounds done
    if (round > totalRounds) {
        return [];
    }

    // Heuristic: Try to find a perfect matching for this round
    // We try multiple times because greedy is randomized
    // As rounds increase, graph gets sparser, so we might need more attempts or just get lucky
    const maxMatchingAttempts = 100;

    for (let i = 0; i < maxMatchingAttempts; i++) {
        const matching = findRandomPerfectMatching(currentEdges, 36);

        if (matching) {
            // Found a valid set of 18 matches for this round
            // Recurse for next round
            const remainingEdges = currentEdges.filter(e => !matching.includes(e));

            const nextResult = recursiveStep(remainingEdges, round + 1, totalRounds);

            if (nextResult) {
                // Success! Mark these matches with current round and return
                const currentRoundMatches = matching.map(m => ({ ...m, matchday: round }));
                return [...currentRoundMatches, ...nextResult];
            }
            // If recursion failed, loop continues (backtrack to try a different matching for this round)
            // But actually, for 8-regular class 1, almost ANY perfect matching is extensible?
            // Not necessarily. But we have 100 attempts at THIS level.
        }
    }

    return null; // Backtrack
};

/**
 * Finds a random perfect matching (size 18) from the edges using greedy strategy.
 */
const findRandomPerfectMatching = (edges: Match[], numTeams: number): Match[] | null => {
    // Optimization: Sort by degree? No, just random shuffle is usually good for regular graphs.
    // LCV (Least Constraining Value) heuristic: pick edges that cover "hard to cover" vertices first?
    // Let's stick to random first.

    // Shuffle edges
    const shuffled = [...edges];
    // Fisher-Yates shuffle for better randomness
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const matching: Match[] = [];
    const usedTeams = new Set<number>();

    for (const match of shuffled) {
        if (!usedTeams.has(match.homeTeam.id) && !usedTeams.has(match.awayTeam.id)) {
            matching.push(match);
            usedTeams.add(match.homeTeam.id);
            usedTeams.add(match.awayTeam.id);
        }

        if (matching.length === numTeams / 2) {
            return matching;
        }
    }

    return null;
};
