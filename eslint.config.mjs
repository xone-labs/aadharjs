import tslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default tslint.config(
    eslint.configs.recommended,
    tslint.configs.recommended
)
