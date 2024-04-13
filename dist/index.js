"use strict";
// index.js
var fs = require("fs");
var path = require("path");
var sharp = require("sharp");
var canRewrite = false;
var outputFile;
var outputExtension;
// check if user type -h or -help
if (process.argv.includes("-h") || process.argv.includes("--help")) {
    console.log("Usage:");
    console.log("\tconverter <inputFile> <outputFile>\t\tSpecify the desired output format (jpeg, png, webp, tiff)");
    console.log("\tconverter <inputFile> <outputExtension>\t\tWill create image with name as inputFile and ext as outputExtension");
    console.log("Options:");
    console.log("\t-h, --help\t\t\t\t\tDisplay this help message");
    console.log("\t-rw, -rewrite\t\t\t\t\tTo rewrite output file if it already exist");
    process.exit(0);
}
// Проверка наличия аргументов командной строки
if (process.argv.length < 4) {
    console.error("Usage: converter <inputFile> <outputFile or outputExtension>");
    process.exit(1);
}
// Получение аргументов командной строки
var inputFile = process.argv[2];
// Проверка существования входного файла
if (!fs.existsSync(inputFile)) {
    console.error("File not found:", inputFile);
    process.exit(1);
}
var outputFileOrExtension = process.argv[3];
// console.log(process.argv);
function checkFormat(ext) {
    if (!["jpeg", "png", "webp", "tiff"].includes(ext)) {
        console.error("Wrong format:", ext);
        process.exit(1);
    }
}
if (outputFileOrExtension.includes(".")) {
    outputFile = outputFileOrExtension;
    outputExtension = path.parse(outputFile).ext.slice(1);
    checkFormat(outputExtension);
}
else {
    checkFormat(outputFileOrExtension);
    outputExtension = outputFileOrExtension;
    outputFile = path.parse(inputFile).name + "." + outputFileOrExtension;
}
// Проверка наличия командных флагов
if (process.argv.includes("-rw") || process.argv.includes("-rewrite")) {
    canRewrite = true;
}
// check if outputFile already exist
fs.access(outputFile, fs.constants.F_OK, function (err) {
    if (!err && !canRewrite) {
        console.error("File already exist");
        console.log("Use flag -rw to rewrite output file");
        process.exit(1);
    }
});
// Convert the image
sharp(inputFile)
    .toFormat(outputExtension)
    .toFile(outputFile, function (err) {
    if (err) {
        console.error("Conversion error:", err);
        process.exit(1);
    }
    else {
        console.log("image successfully ".concat(canRewrite ? "rewritten" : "converted", ": ").concat(outputFile));
        // console.log("inputFile:", inputFile);
        // console.log("outputFile:", outputFile);
        // console.log("outputExtension:", outputExtension);
        // console.log("Image successfully converted:", info);
        process.exit(0);
    }
});