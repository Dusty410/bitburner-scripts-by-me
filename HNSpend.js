/** @param {import(".").NS } ns */
export async function main(ns) {
    let spendOn;
    if (ns.args.length == 0) {
        spendOn = 'Sell for Money';
    } else {
        spendOn = ns.args[0];
    }

    while(true) {
        if (ns.hacknet.numHashes() > 4) {
            ns.hacknet.spendHashes(spendOn);
        }
        await ns.sleep(1);
    }
}