# AadharJS

AadharJS is a library for decoding and validating Aadhar QR code data. It provides functions to decode QR code data into Aadhar information and validate mobile and email hashes.

## Installation

To install the library, use npm or yarn:

```bash
npm install @xone-labs/aadharjs
# or
yarn add @xone-labs/aadharjs
```

## Usage

### Decoding QR Code Data

To decode QR code data, use the `decode` function:

```typescript
import { QR } from '@xone-labs/aadharjs';

const qrData = '...'; // QR code data as a string
const aadhar = QR.decode(qrData);

console.log(aadhar);
```

### Validating Mobile Hash

To validate the mobile hash, use the `validateMobileHash` function:

```typescript
import { QR } from '@xone-labs/aadharjs';

const isValid = await QR.validateMobileHash(aadhar, '1234567890');
console.log(isValid); // true or false
```

### Validating Email Hash

To validate the email hash, use the `validateEmailHash` function:

```typescript
import { QR } from '@xone-labs/aadharjs';

const isValid = await QR.validateEmailHash(aadhar, 'example@example.com');
console.log(isValid); // true or false
```

### Validating Aadhar Number/Virtual ID

To validate the Aadhar number or Virtual ID, use the `validate` function:

```typescript
import { Validator } from '@xone-labs/aadharjs';

const isValid = Validator.validate('123456789012');
console.log(isValid); // true or false
```


## License

This project is licensed under the MIT License.

## Contributors

- [Mohinish Sharma](https://github.com/mohinishsharma)
