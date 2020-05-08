interface IConfig {
    bufferSize?: number;
    pollIntervalMs?: number;
    debug?: boolean;
}
declare const _default: (apiKey: string, config?: IConfig) => void;
export default _default;
