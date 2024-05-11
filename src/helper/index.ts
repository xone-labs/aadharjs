import { inflate } from "pako";

export async function generateSha256Hash(data: string) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    return crypto.subtle.digest('SHA-256', dataBuffer).then(hashBuffer => bufferToHex(new Uint8Array(hashBuffer)));
}


export function bufferToHex(buffer: Uint8Array): string {
    return Array.prototype.map.call(buffer, (x: number) => ('00' + x.toString(16)).slice(-2)).join('');
}


export function inflateQRData(data: string): Uint8Array {
    const dataBigInt = BigInt(data);
    const hexData = dataBigInt.toString(16);
    const byteArrayMatch = hexData.match(/.{1,2}/g);
    const uint8Array = Uint8Array.from(byteArrayMatch.map(byte => parseInt(byte, 16)));
    return inflate(uint8Array);
}
