export interface INPMPackage {
    readonly name: string;

    readonly scripts?: {
        [cmd: string]: string;
    };

    readonly main?: string;

    readonly dependencies?: {
        [package: string]: string;
    };

    readonly devDependencies?: {
        [package: string]: string;
    };

    readonly private?: boolean;

    readonly version?: string;
}
