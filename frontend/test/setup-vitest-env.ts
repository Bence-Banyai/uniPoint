import { TextEncoder, TextDecoder } from "util";

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder as any;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder as any;
