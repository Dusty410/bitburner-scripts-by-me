/** @param {import(".").NS } ns */
export async function main(ns) {
    
}

/*
Compression I: RLE Compression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of a repeated single
character. Runs are encoded as a length, followed by the character itself. Lengths are encoded as a single ASCII digit;
runs of 10 characters or more are encoded by splitting them into multiple runs.

You are given the following input string:
    <data>
Encode it using run-length encoding with the minimum possible output length.

Examples:
    aaaaabccc            ->  5a1b3c
    aAaAaA               ->  1a1A1a1A1a1A
    111112333            ->  511233
    zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
*/