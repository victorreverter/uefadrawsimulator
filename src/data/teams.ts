import type { Team } from '../types';

export const teams: Team[] = [
    // Pot 1
    { id: 1, name: 'Paris Saint-Germain', country: 'France', countryCode: 'FRA', pot: 1 },
    { id: 2, name: 'Manchester City', country: 'England', countryCode: 'ENG', pot: 1 },
    { id: 3, name: 'Real Madrid', country: 'Spain', countryCode: 'ESP', pot: 1 },
    { id: 4, name: 'Bayern München', country: 'Germany', countryCode: 'GER', pot: 1 },
    { id: 5, name: 'Liverpool', country: 'England', countryCode: 'ENG', pot: 1 },
    { id: 6, name: 'Inter Milan', country: 'Italy', countryCode: 'ITA', pot: 1 },
    { id: 7, name: 'Borussia Dortmund', country: 'Germany', countryCode: 'GER', pot: 1 },
    { id: 8, name: 'Barcelona', country: 'Spain', countryCode: 'ESP', pot: 1 },
    { id: 9, name: 'Chelsea', country: 'England', countryCode: 'ENG', pot: 1 },

    // Pot 2
    { id: 10, name: 'Arsenal', country: 'England', countryCode: 'ENG', pot: 2 },
    { id: 11, name: 'Bayer Leverkusen', country: 'Germany', countryCode: 'GER', pot: 2 },
    { id: 12, name: 'Atlético Madrid', country: 'Spain', countryCode: 'ESP', pot: 2 },
    { id: 13, name: 'Benfica', country: 'Portugal', countryCode: 'POR', pot: 2 },
    { id: 14, name: 'Atalanta', country: 'Italy', countryCode: 'ITA', pot: 2 },
    { id: 15, name: 'Juventus', country: 'Italy', countryCode: 'ITA', pot: 2 },
    { id: 16, name: 'Eintracht Frankfurt', country: 'Germany', countryCode: 'GER', pot: 2 },
    { id: 17, name: 'Villarreal', country: 'Spain', countryCode: 'ESP', pot: 2 },
    { id: 18, name: 'Club Brugge', country: 'Belgium', countryCode: 'BEL', pot: 2 },

    // Pot 3
    { id: 19, name: 'Tottenham Hotspur', country: 'England', countryCode: 'ENG', pot: 3 },
    { id: 20, name: 'PSV Eindhoven', country: 'Netherlands', countryCode: 'NED', pot: 3 },
    { id: 21, name: 'Sporting CP', country: 'Portugal', countryCode: 'POR', pot: 3 },
    { id: 22, name: 'Ajax', country: 'Netherlands', countryCode: 'NED', pot: 3 },
    { id: 23, name: 'Slavia Praha', country: 'Czech Republic', countryCode: 'CZE', pot: 3 },
    { id: 24, name: 'Napoli', country: 'Italy', countryCode: 'ITA', pot: 3 },
    { id: 25, name: 'Olympiacos', country: 'Greece', countryCode: 'GRE', pot: 3 },
    { id: 26, name: 'Marseille', country: 'France', countryCode: 'FRA', pot: 3 },
    { id: 27, name: 'Bodø/Glimt', country: 'Norway', countryCode: 'NOR', pot: 3 },

    // Pot 4
    { id: 28, name: 'Monaco', country: 'France', countryCode: 'FRA', pot: 4 },
    { id: 29, name: 'Athletic Bilbao', country: 'Spain', countryCode: 'ESP', pot: 4 },
    { id: 30, name: 'Galatasaray', country: 'Turkey', countryCode: 'TUR', pot: 4 },
    { id: 31, name: 'Newcastle United', country: 'England', countryCode: 'ENG', pot: 4 },
    { id: 32, name: 'Copenhagen', country: 'Denmark', countryCode: 'DEN', pot: 4 },
    { id: 33, name: 'Union Saint-Gilloise', country: 'Belgium', countryCode: 'BEL', pot: 4 },
    { id: 34, name: 'Qarabağ', country: 'Azerbaijan', countryCode: 'AZE', pot: 4 },
    { id: 35, name: 'Pafos', country: 'Cyprus', countryCode: 'CYP', pot: 4 },
    { id: 36, name: 'Kairat Almaty', country: 'Kazakhstan', countryCode: 'KAZ', pot: 4 },
];

export const getTeamsByPot = (pot: 1 | 2 | 3 | 4): Team[] => {
    return teams.filter(team => team.pot === pot);
};

export const getTeamById = (id: number): Team | undefined => {
    return teams.find(team => team.id === id);
};
