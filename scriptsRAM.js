/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tail();

    var files = ns.ls('home');
    for (let i in files) {
        var current = files[i];
        if (current.includes('.js')) {
            ns.print(
                current.padStart(20, ' ') + ": " + ns.getScriptRam(current) + " GiB"
            );
        }
    }
}