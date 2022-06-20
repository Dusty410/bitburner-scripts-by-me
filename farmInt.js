/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.singularity.checkFactionInvitations().forEach(ns.singularity.joinFaction);
    if (ns.singularity.checkFactionInvitations().length === 0) {
        ns.singularity.softReset('farmInt.js');
    }
}