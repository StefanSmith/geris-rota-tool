function createSystemClock() {
    return {getCurrentTime: () => new Date()};
}

export default createSystemClock;