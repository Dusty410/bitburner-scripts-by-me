/** @param {import(".").NS } ns */
export async function main(ns) {
    const STARTUP = [
        'singularity.js',
        'HNSpend.js',
        'HNUpgrade.js',
        'gang.js',
        'gangWarSwitch.js',
        'sleeve.js',
        'execBatch.js',
        'expandDroids.js',
        'bladeburner.js'
    ];

    STARTUP.forEach(x => ns.run(x));
}