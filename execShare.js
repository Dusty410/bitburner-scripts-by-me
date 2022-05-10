/** @param {import(".").NS } ns */
export async function main(ns) {
    var server_list = ns.getPurchasedServers(); // only use droids
    server_list.push('home');

    // figure out free ram on server, with special circumstances for home
    for (let i in server_list) {
        var server = server_list[i];
        var free_ram;
        if (server == 'home') {
            free_ram = ns.getServerMaxRam(server) - 32;
        } else {
            free_ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        }
        var share_threads = Math.floor(free_ram / ns.getScriptRam('share.js'));

        ns.exec('share.js', server, share_threads);
    }

    ns.tprint(ns.getSharePower());
}