import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const CI = process.env.CI === 'true';
const configuredMultiplier = Number(process.env.TIMEOUT_MULTIPLIER);
const multiplier = configuredMultiplier || (CI ? 2 : 1);

export const ELEMENT_WAIT_TIME = 5000 * multiplier;
export const ELEMENT_WAIT_LONGER_TIME = 15000 * multiplier;
export const ELEMENT_WAIT_EXTRA_LONG_TIME = 30000 * multiplier;
