/** @param {import(".").NS } ns */
export async function main(ns) {
    var servers;
    if (ns.args.length > 0) {
        servers = ns.args;
    } else {
        servers = ns.read('/text/targetList.txt').split(',');
    }

    for (let i in servers) {
        var current = servers[i];
        var pad = 20;
        ns.tprint(
            "\n" + (current + ": ") + 
            "\n" + ("cur $" + Intl.NumberFormat('en-US').format(ns.getServerMoneyAvailable(current))).padEnd(pad, ' ') +
            ("cur sec " + ns.getServerSecurityLevel(current)).padStart(pad, ' ') +
            "\n" + ("max $" + Intl.NumberFormat('en-US').format(ns.getServerMaxMoney(current))).padEnd(pad, ' ') +
            ("min sec " + ns.getServerMinSecurityLevel(current)).padStart(pad, ' ')
        );
    }
}