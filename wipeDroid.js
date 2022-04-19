/** @param {NS} ns */
export async function main(ns) {
	var server = ns.args[0];
	ns.killall(server)
	if (ns.deleteServer(server)) {
		ns.tprint("Successfully wiped " + server);
	}
}