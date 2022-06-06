/** @param {import(".").NS } ns */
export async function main(ns) {

    /*
    Array Jumping Game
    You are attempting to solve a Coding Contract. You have 1 tries remaining, after which the contract will self-destruct.

    You are given the following array of integers:

    <data>

    Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at 
    position i and your maximum jump length is n, you can jump to any position from i to i+n.

    Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

    Your answer should be submitted as 1 or 0, representing true and false respectively
    */

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

    /*
    Compression III: LZ Compression
    You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


    Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of 
    the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded 
    as a single ASCII digit from 1 - 9, followed by the chunk data, which is either:

    1. Exactly L characters, which are to be copied directly into the uncompressed data.
    2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII 
    digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

    For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start 
    of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

    You are given the following input string:
        <data>
    Encode it using Lempel-Ziv encoding with the minimum possible output length.

    Examples (some have other possible encodings of minimal length):
        abracadabra     ->  7abracad47
        mississippi     ->  4miss433ppi
        aAAaAAaAaAA     ->  3aAA53035
        2718281828      ->  627182844
        abcdefghijk     ->  9abcdefghi02jk
        aaaaaaaaaaaa    ->  3aaa91
        aaaaaaaaaaaaa   ->  1a91031
        aaaaaaaaaaaaaa  ->  1a91041
    */

    /*
    Unique Paths in a Grid I
    You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

    You are in a grid with <random> rows and <random> columns, and you are positioned in the top-left corner of that grid. You are 
    trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. Determine 
    how many unique paths there are from start to finish.

    NOTE: The data returned for this contract is an array with the number of rows and columns:

    [10, 12]
    */

    /*
    Minimum Path Sum in a Triangle
    You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


    Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to adjacent
    numbers in the row below. The triangle is represented as a 2D array of numbers:

    <data>

    Example: If you are given the following triangle:

    [
       [2],
      [3,4],
     [6,5,7],
    [4,1,8,3]
    ]

    The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
    */

    /*
    Proper 2-Coloring of a Graph
    You are attempting to solve a Coding Contract. You have 5 tries remaining, after which the contract will self-destruct.


    You are given the following data, representing a graph:

    <data>

    Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting.
    The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between
    0 and 10. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be
    adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.
    You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either
    0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element
    i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit
    an empty array.

    Examples:

    Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
    Output: [0, 0, 1, 1]

    Input: [3, [[0, 1], [0, 2], [1, 2]]]
    Output: []
    */
}