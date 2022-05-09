/** @param {import(".").NS } ns */
export async function main(ns) {
    // var crime = 'Homicide';
    // for (let i = 0; i < ns.args[0]; i++) {
    //     ns.singularity.commitCrime(crime);
    //     await ns.sleep(ns.singularity.getCrimeStats(crime).time + 25);
    // }
    while (true) {
        if (!ns.singularity.isBusy()) {
            ns.singularity.commitCrime('Mug');
        }
        await ns.sleep(25);
    }
}