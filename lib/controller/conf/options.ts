export default class Options {
    private version: string;
    private isLatest: boolean;

    constructor(version: string, isLatest: boolean) {
        this.version = version;
        this.isLatest = isLatest;
    }

    public getVersion(): string {
        return this.version;
    }

    public getIsLatest(): boolean {
        return this.isLatest;
    }
}

Object.seal(Options);
