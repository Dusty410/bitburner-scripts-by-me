/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();

    var stats = ns.getBitNodeMultipliers();
    var names = Object.keys(stats)

    for (let i = 0; i < names.length; i += 1) {
        var name = names[i];
        ns.print(name + ": " + stats[name]);
    }
}