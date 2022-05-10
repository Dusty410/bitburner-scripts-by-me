/** @param {import(".").NS } ns */
export async function main(ns) {
    let crime;
    if (ns.args.length == 0) {
        crime = 'Shoplift';
    } else {
        crime = ns.args[0];
    }

    while (true) {
        if (!ns.singularity.isBusy()) {
            ns.singularity.commitCrime(crime);
        }
        await ns.sleep(25);
    }
}