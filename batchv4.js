/** @param {import(".").NS } ns */
export async function main(ns) {
    let host = ns.args[0];
    let target = ns.args[1];

    // sec incr/decr amounts
    const HACK_SEC_INCR = 0.002;
    const GROW_SEC_INCR = 0.004;
    const WEAKEN_SEC_DECR = 0.05;

    const HACK_SCRIPT_RAM = ns.getScriptRam('hackv2.js', host);
    const GROW_SCRIPT_RAM = ns.getScriptRam('grow.js', host);
    const WEAKEN_SCRIPT_RAM = ns.getScriptRam('weaken.js', host);
    const BATCH_SCRIPT_RAM = ns.getScriptRam('batchv4.js', 'home');
    const HOME_SCRIPTS = ns.read('/text/reservedScripts.txt').split(',');

    // arbitrary amount of RAM to keep free on home
    const HOME_KEEP_FREE = 32;

    let homeUsedRAM = HOME_SCRIPTS.reduce((total, element) => total + ns.getScriptRam(element, 'home'));
}