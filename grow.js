/** @param {import(".").NS } ns */
export async function main(ns) {
    var target = ns.args[0];
    await ns.sleep(ns.args[1]);
    await ns.grow(target);
}