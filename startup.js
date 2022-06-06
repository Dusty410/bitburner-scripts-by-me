/** @param {import(".").NS } ns */
export async function main(ns) {
    let startup = [
        'crawlv2.js',
        'singularity.js',
        'HNSpend.js',
        'HNUpgrade.js',
        'sleeve.js',
        'execBatch.js'
    ];

    if (ns.getPurchasedServerLimit() > 0) {
        startup.push('expandDroids.js');
    }

    if (ns.gang.inGang()) {
        startup = startup.concat(['gang.js', 'gangWarSwitch.js'])
    } else {
        startup.push('crime.js')
    }

    if (ns.getPlayer().inBladeburner
        && ns.gang.inGang()) {
        startup.push('bladeburner.js');
    }

    // if home RAM is greater than 1 TiB, start corp script
    if (ns.getServerMaxRam('home') > 2 ** 10) {
        startup.push('corp.js');
    }

    let RAMNeeded = startup.map(x => ns.getScriptRam(x)).reduce((a, b) => a + b) + ns.getScriptRam('startup.js');
    ns.tprint('RAM needed for startup scripts: ' + RAMNeeded);
    ns.tprint('Total RAM on home server: ' + ns.getServerMaxRam('home'));
    startup.forEach(x => ns.run(x));
    await ns.write('/text/reservedScripts.txt', startup, 'w');
}