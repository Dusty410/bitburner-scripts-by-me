/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog('sleep');

    let target = ns.args[0] ?? 0;

    const KARMA_FOR_GANG = -54000;

    function getCrime() {
        let shopliftChance = ns.singularity.getCrimeChance('Shoplift');
        let mugChance = ns.singularity.getCrimeChance('Mug');

        let crimeToCommit = 'Shoplift';

        if (shopliftChance >= 1 && mugChance < 1) {
            crimeToCommit = 'Mug';
        }

        if (shopliftChance >= 1 && mugChance >= 1) {
            crimeToCommit = 'Homicide';
        }

        return crimeToCommit;
    }

    if (ns.singularity.isBusy()) {
        ns.singularity.stopAction();
    }

    while (ns.heart.break() > KARMA_FOR_GANG ||
        ns.getPlayer().numPeopleKilled < target
    ) {
        if (!ns.singularity.isBusy()) {
            ns.singularity.commitCrime(getCrime());
            ns.print('Karma: ' + Math.ceil(ns.heart.break()));
            ns.print('Shoplift chance: ' + ns.singularity.getCrimeChance('Shoplift'));
            ns.print('Mug chance: ' + ns.singularity.getCrimeChance('Mug'));
            ns.print('Homicide chance: ' + ns.singularity.getCrimeChance('Homicide'));
            ns.print('Number of people killed: ' + ns.getPlayer().numPeopleKilled)
        }
        await ns.sleep(25);
    }
}