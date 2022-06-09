/** @param {import(".").NS } ns */
export async function main(ns) {

    // TODO: add logic to automatically decide what to spend hashes on
    // needs to communicate with corp script for research
    
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

    // const SPEND = {
    //     money: 'Sell for Money',
    //     corpf: 'Sell for Corporation Funds',
    //     corpr: 'Exchange for Corporation Research',
    //     blader: 'Exchange for Bladeburner Rank',
    //     blades: 'Exchange for Bladeburner SP'
    // }

    // let spendOn = SPEND.money;

    while (true) {
        // if (
        //     ns.getPlayer().hasCorporation
        // ) {
        //     spendOn = SPEND.corpf
        // }

        
        if (ns.hacknet.numHashes() > ns.hacknet.hashCost(spendOn)) {
            ns.hacknet.spendHashes(spendOn);
        }
        await ns.sleep(25);
    }
}