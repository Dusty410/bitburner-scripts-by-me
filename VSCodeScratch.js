/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tprint(ns.getRunningScript('HNSpend.js').args);
}