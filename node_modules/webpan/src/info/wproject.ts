import yargs = require("yargs");
import fs = require("fs/promises");
import path = require("path");

import type wmanifest = require("../types/wmanifest");

async function createProjectManifest(
    root: string,
    yargs: yargs.ArgumentsCamelCase<{}>
): Promise<wmanifest.WManifest> {
    const content = await fs.readFile(path.join(root, "wproject.json"), "utf8");
    let wproject: any;
    try {
        wproject = JSON.parse(content);
    } catch (e) {
        if (typeof e === "object" && e !== null && "stack" in e) {
            e = e.stack;
        }
        throw new Error(`Error parsing wproject.json because ${e}`);
    }

    wproject.format ??= {};
    wproject.cmd ??= {};
    wproject.cmd.build ??= {};

    return {
        format: {
            tabSpaces:
                (yargs.tabSpaces as number) ?? wproject.format.tabSpaces ?? 4,
            buildInfo:
                yargs.formatbuildinfo ?? wproject.format.buildInfo ?? false,
        },
        cmd: {
            build: {
                clean:
                    (yargs.clean as boolean) ??
                    wproject.cmd.build.clean ??
                    false,
            },
        },
    };
}

export = {
    createProjectManifest,
};
