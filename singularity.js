/** @param {import(".").NS } ns */
export async function main(ns) {
    while (!ns.singularity.isBusy()) {
        ns.singularity.commitCrime('Shoplift');
        await ns.sleep(1);
    }
}