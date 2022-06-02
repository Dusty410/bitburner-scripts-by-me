/** @param {import(".").NS } ns */
export async function main(ns) {
    let startup = [
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
    }

    if (ns.getPlayer().inBladeburner) {
        startup.push('bladeburner.js');
    }

    startup.forEach(x => ns.run(x));
}