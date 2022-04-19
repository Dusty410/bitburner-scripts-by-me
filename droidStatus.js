/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();

	var server_list = ns.getPurchasedServers();
	var pad = 33;
	var max_ram = 0;

	// // find highest ram
	// for (let i in server_list) {
	// 	var current = server_list[i];
	// 	var current_ram = ns.getServerMaxRam(current);
	// 	if (current_ram > max_owned_ram) {
	// 		max_owned_ram = current_ram;
	// 		max_ram_droid = current;
	// 	}
	// }

	server_list.sort(function (a, b) { return a - b });
	for (let i in server_list) {
		var current = server_list[i];
		var current_ram = ns.getServerMaxRam(current);
		if (max_ram < current_ram) {
			max_ram = current_ram;
		}
		ns.print(
			(current + ", level " + Math.log2(ns.getServerMaxRam(current)) + ", RAM: " + ns.getServerMaxRam(current)).padStart(pad, ' ')
		);
	}
	ns.print(
		"INFO\n" + "Droid count: ".padStart(pad, " ") + server_list.length + "\n" + "Max possible droids: ".padStart(pad, " ") +
		ns.getPurchasedServerLimit() + "\n" + "Highest level: ".padStart(pad, " ") + Math.log2(max_ram)
	);
}