/**
 * @enum State
 * Represents the game status, this enum is usefull for all databases updates
 */
export enum State {
    Created = 0,
    Aborted = 1,
    Playing = 2,
    WonTeam1 = 3,
    WonTeam2 = 4,
}