/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.tprint(ns.heart.break());
    // ns.tprint(ns.gang.getChanceToWinClash('NiteSec'));
    let infilLocs = ns.infiltration.getPossibleLocations()
    ns.tprint(infilLocs);
    // await ns.sleep(5 * 1e3);
}