export interface Team {
    id: number;
    name: string;
    country: string;
    countryCode: string;
    pot: 1 | 2 | 3 | 4;
}

export interface Matchup {
    opponent: Team;
    isHome: boolean;
}

export interface TeamDrawResult {
    team: Team;
    opponents: Matchup[];
}

export interface DrawState {
    results: TeamDrawResult[];
    isDrawing: boolean;
    isComplete: boolean;
    currentTeamIndex: number;
}

export interface Match {
    id: string; // unique match ID
    homeTeam: Team;
    awayTeam: Team;
    matchday: number;
}

export interface Fixture {
    matchday: number;
    matches: Match[];
}
