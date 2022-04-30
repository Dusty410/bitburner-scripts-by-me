/** @param {import(".").NS } ns */
export async function main(ns) {
    var crime = 'Deal drugs';
    for (let i = 0; i < ns.args[0]; i++) {
        ns.singularity.commitCrime(crime);
        await ns.sleep(ns.singularity.getCrimeStats(crime).time + 25);
    }
}