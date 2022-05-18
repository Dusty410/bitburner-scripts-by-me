/** @param {import(".").NS } ns */
export async function main(ns) {
    let spendOn;
    if (ns.args.length == 0) {
        spendOn = 'Sell for Money';
    } else {
        switch (ns.args[0]) {
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
    }

    while (true) {
        if (ns.hacknet.numHashes() > ns.hacknet.hashCost(spendOn)) {
            ns.hacknet.spendHashes(spendOn);
        }
        await ns.sleep(1);
    }
}