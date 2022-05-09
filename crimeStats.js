/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog('ALL');
    ns.clearLog();

    var crimes = ['Shoplift', 'Rob store', 'Mug', 'Larceny', 'Deal Drugs', 'Bond Forgery',
        'Traffick Arms', 'Homicide', 'Grand Theft Auto', 'Kidnap', 'Assassination', 'Heist'];

    for (let i in crimes) {
        var crime = crimes[i];
        ns.print(ns.singularity.getCrimeStats(crime));
    }

    // document.getElementById();
}