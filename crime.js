/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog('sleep');

    const KARMA_FOR_GANG = -54000;

    let crime;
    if (ns.args.length == 0) {
        crime = 'Shoplift';
    } else {
        crime = ns.args[0];
    }

    if (ns.singularity.isBusy()) {
        ns.singularity.stopAction();
    }

    while (ns.heart.break() > KARMA_FOR_GANG) {
        if (!ns.singularity.isBusy()) {
            ns.singularity.commitCrime(crime);
            ns.print('Karma: ' + Math.ceil(ns.heart.break()));
        }
        await ns.sleep(25);
    }
}