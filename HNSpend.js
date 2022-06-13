/** @param {import(".").NS } ns */
export async function main(ns) {
    let spendOn = ns.args[0] ?? 'Sell for Money';
    // update if arg is provided
    switch (spendOn) {
        case 'corpf':
            spendOn = 'Sell for Corporation Funds';
            break;
        case 'corpr':
            spendOn = 'Exchange for Corporation Research';
            break;
        case 'blader':
            spendOn = 'Exchange for Bladeburner Rank';
            break;
        case 'blades':
            spendOn = 'Exchange for Bladeburner SP';
    }

    while (true) {
        if (ns.hacknet.numHashes() > ns.hacknet.hashCost(spendOn)) {
            ns.hacknet.spendHashes(spendOn);
        }
        await ns.sleep(25);
    }
}