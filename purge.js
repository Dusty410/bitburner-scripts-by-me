/** @param {NS} ns */
export async function main(ns) {
	var server_list = ns.scan('home');
	for (let i in server_list) {
		var files = ns.ls(server_list[i], ".js");
		for (let j in files) {
			ns.rm(files[j], server_list[i]);
		}
	}
}