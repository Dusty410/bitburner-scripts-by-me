/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();

	var server_list = ns.getPurchasedServers();
	var max_ram = 0;

	var nameColumn = "Name";
	var tierColumn = "Tier";
	var RAMColumn = "RAM GiB";

	var nameColumnPad = 7;
	var tierColumnPad = 4;
	var RAMColumnPad = 9;

	ns.print(
		"┌".padEnd(nameColumnPad + 1, '─') +
		"┬".padEnd(tierColumnPad + 1, '─') +
		"┬".padEnd(RAMColumnPad + 1, '─') + "┐"
	)

	ns.print(
		"│" + nameColumn.padEnd(nameColumnPad, ' ') +
		"│" + tierColumn.padEnd(tierColumnPad, ' ') +
		"│" + RAMColumn.padEnd(RAMColumnPad, ' ') + "│"
	);

	ns.print(
		"├".padEnd(nameColumnPad + 1, '─') +
		"┼".padEnd(tierColumnPad + 1, '─') +
		"┼".padEnd(RAMColumnPad + 1, '─') + "┤"
	);

	for (let i in server_list) {
		var current = server_list[i];
		var current_ram = ns.getServerMaxRam(current);
		if (max_ram < current_ram) {
			max_ram = current_ram;
		}
		ns.print(
			"│" + current.padStart(nameColumnPad, ' ') + 
			"│" + Math.log2(ns.getServerMaxRam(current)).toString().padStart(tierColumnPad, ' ') +
			"│" + Intl.NumberFormat('en-US').format(ns.getServerMaxRam(current)).padStart(RAMColumnPad, ' ') + "│"
		);
	}

	ns.print(
		"└".padEnd(nameColumnPad + 1, '─') +
		"┴".padEnd(tierColumnPad + 1, '─') +
		"┴".padEnd(RAMColumnPad + 1, '─') + "┘"
	);
}