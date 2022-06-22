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

    // start corp script if we have the RAM
    if (ns.getServerMaxRam('home') > ns.getScriptRam('corp.js', 'home')) {
        startup.push('corp.js');
    }

    let RAMNeeded = startup.reduce((a, b) => a + ns.getScriptRam(b)) + ns.getScriptRam('startup.js');
    ns.tprint('RAM needed for startup scripts: ' + RAMNeeded);
    ns.tprint('Total RAM on home server: ' + ns.getServerMaxRam('home'));
    startup.forEach(x => ns.run(x));
    await ns.write('/text/reservedScripts.txt', startup, 'w');
}