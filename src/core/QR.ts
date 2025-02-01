import { bufferToHex, generateSha256Hash, inflateQRData } from "../helper";
import { Address } from "./types/Address";

export interface Aadhar {
    version?: string;
    mobileEmailLink: string;
    referenceId: string;
    name: string;
    dob: string;
    gender: string;
    address: Address;
    lastMobile4Digits?: string;
    image?: Uint8Array;
    mobileHash?: string;
    emailHash?: string;
    signature: string;
}

const DATA_SEPARATOR = 255;
const VERSION_MARKER = 86;

const INVALID_START_MARKER = 60;

const JPEG2000_MARKER = [255, 79];

const HASH_BYTE_SIZE = 32;
const SIGN_BYTE_SIZE = 256;

const aadharQRTextDataOrder = [
    "version",
    "mobileEmailLink",
    "referenceId",
    "name",
    "dob",
    "gender",
    "address.co",
    "address.district",
    "address.landmark",
    "address.house",
    "address.location",
    "address.pincode",
    "address.po",
    "address.state",
    "address.street",
    "address.subdist",
    "address.vtc",
    "lastMobile4Digits",
]

/**
 * Decodes the QR Code data to Aadhar data
 * @param qr QR Code data
 * @returns
 */
export function decode(qr: string): Aadhar {
    const data = inflateQRData(qr);
    let version = 0;
    const firstByte = data[0];
    if (firstByte === VERSION_MARKER) {
        version = parseInt(String.fromCharCode(data[1]));
    } else if (firstByte === INVALID_START_MARKER) {
        throw new Error("Invalid QR Code");
    }

    const aadhar = {} as Aadhar;

    let offset = -1;

    aadharQRTextDataOrder.map(key => {
        if (version !== 2 && ["lastMobile4Digits", "version"].indexOf(key) !== -1) {
            return;
        }
        const dataEndIndex = data.findIndex((byte, index) => index > offset && byte === DATA_SEPARATOR);
        const dataSlice = data.slice(offset + 1, dataEndIndex);
        const dataString = String.fromCharCode(...dataSlice);
        if (key.startsWith("address.")) {
            const addressKey = key.split(".")[1];
            if (!aadhar.address) {
                aadhar.address = {} as Address;
            }
            Object.assign(aadhar.address, { [addressKey]: dataString });
            offset = dataEndIndex;
            return;
        }
        Object.assign(aadhar, { [key]: dataString });
        offset = dataEndIndex;
    });

    const hasImage = data.findIndex((byte, index) => byte === JPEG2000_MARKER[0] && data[index + 1] === JPEG2000_MARKER[1]);
    if (hasImage) {
        const imageIndex = offset + 1;
        const imageEndIndex = data.length - SIGN_BYTE_SIZE - (Math.max(version !== 2 ? parseInt(aadhar.mobileEmailLink) - 1 : 1, 0) * HASH_BYTE_SIZE);
        if (imageIndex !== -1 && imageEndIndex !== -1) {
            const image = data.slice(imageIndex, imageEndIndex);
            aadhar.image = image;
            offset = imageEndIndex - 1;
        }
    }

    if (aadhar.mobileEmailLink === "3" || aadhar.mobileEmailLink === "2") {
        const emailIndex = offset + 1;
        const hash = data.slice(offset + 1, emailIndex + HASH_BYTE_SIZE);
        aadhar.emailHash = bufferToHex(hash);
        offset = emailIndex + HASH_BYTE_SIZE - 1;
    }
    if ((aadhar.mobileEmailLink === "3" || aadhar.mobileEmailLink === "1") && version !== 2) {
        const hashIndex = offset + 1;
        const hash = data.slice(hashIndex, hashIndex + HASH_BYTE_SIZE);
        aadhar.mobileHash = bufferToHex(hash);
        offset = hashIndex + HASH_BYTE_SIZE - 1;
    }

    const signature = data.slice(offset + 1);
    aadhar.signature = bufferToHex(signature);

    return aadhar;

}

export async function validateMobileHash(aadhar: Aadhar, mobile: string): Promise<boolean> {
    const referenceId = aadhar.referenceId;
    const fourthDigit = parseInt(referenceId[3]);
    const rehashing = fourthDigit < 2 ? 1 : fourthDigit;
    const hash = aadhar.mobileHash;
    let mobileHash = await generateSha256Hash(mobile);
    for (let i = 1; i < rehashing; i++) {
        mobileHash = await generateSha256Hash(mobileHash);
    }
    return hash === mobileHash;
}

export async function validateEmailHash(aadhar: Aadhar, email: string): Promise<boolean> {
    const referenceId = aadhar.referenceId;
    const fourthDigit = parseInt(referenceId[3]);
    const rehashing = fourthDigit < 2 ? 1 : fourthDigit;
    const hash = aadhar.emailHash;
    let emailHash = await generateSha256Hash(email);
    for (let i = 1; i < rehashing; i++) {
        emailHash = await generateSha256Hash(emailHash);
    }
    return hash === emailHash;
}

