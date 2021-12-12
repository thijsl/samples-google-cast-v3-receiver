export interface AdDescription {
    integration: string | undefined;
    sources: AdSource;
    timeOffset: string | number;
}

export interface AdSource {
    src: string;
    type: string;
}