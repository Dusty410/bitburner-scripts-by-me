/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog('ALL');
    ns.clearLog();

    var droidList = ns.getPurchasedServers();
    var maxRAM = 0;

    var nameColumn = "Name";
    var tierColumn = "Tier";
    var RAMColumn = "RAM GiB";

    var nameColumnPad = 7;
    var tierColumnPad = 4;
    var RAMColumnPad = 9;

    ns.print(
        "┌".padEnd(nameColumnPad + 1, '─') +
        "┬".padEnd(tierColumnPad + 1, '─') +
        "┬".padEnd(RAMColumnPad + 1, '─') + "┐"
    )

    ns.print(
        "│" + nameColumn.padEnd(nameColumnPad, ' ') +
        "│" + tierColumn.padEnd(tierColumnPad, ' ') +
        "│" + RAMColumn.padEnd(RAMColumnPad, ' ') + "│"
    );

    ns.print(
        "├".padEnd(nameColumnPad + 1, '─') +
        "┼".padEnd(tierColumnPad + 1, '─') +
        "┼".padEnd(RAMColumnPad + 1, '─') + "┤"
    );

    for (let i in droidList) {
        var current = droidList[i];
        var currentRAM = ns.getServerMaxRam(current);
        if (maxRAM < currentRAM) {
            maxRAM = currentRAM;
        }
        ns.print(
            "│" + current.padStart(nameColumnPad, ' ') + 
            "│" + Math.log2(ns.getServerMaxRam(current)).toString().padStart(tierColumnPad, ' ') +
            "│" + Intl.NumberFormat('en-US').format(ns.getServerMaxRam(current)).padStart(RAMColumnPad, ' ') + "│"
        );
    }

    ns.print(
        "└".padEnd(nameColumnPad + 1, '─') +
        "┴".padEnd(tierColumnPad + 1, '─') +
        "┴".padEnd(RAMColumnPad + 1, '─') + "┘"
    );

    let countString = "Droid count: " + droidList.length;
    let limitString = "Droid limit: " + ns.getPurchasedServerLimit();
    ns.print(countString + "\n" + limitString + "\n" + "─".repeat(limitString.length));
}