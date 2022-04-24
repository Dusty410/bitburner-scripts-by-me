/** @param {import(".").NS } ns */
export async function main(ns) {
    while (true) {
        if (!ns.singularity.isBusy()) {
            ns.singularity.commitCrime('Heist');
        }
        await ns.sleep(25);
    }
}