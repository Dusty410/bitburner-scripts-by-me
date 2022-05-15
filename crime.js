/** @param {import(".").NS } ns */
export async function main(ns) {
    let crime;
    if (ns.args.length == 0) {
        crime = 'Shoplift';
    } else {
        crime = ns.args[0];
    }

    if (ns.singularity.isBusy()) {
        ns.singularity.stopAction();
    }

    // while (document.getElementsByClassName('MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-18awf20')) {
    while (true) {
        if (!ns.singularity.isBusy()) {
            ns.singularity.commitCrime(crime);
        }
        await ns.sleep(25);
    }
}