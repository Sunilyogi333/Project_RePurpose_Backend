import crypto from 'crypto';

/**
 * Generates a secure OTP of the specified length.
 * @param length The length of the OTP. Default is 6.
 * @returns A numeric OTP as a string.
 */
export const generateOtp = (length: number = 6): string => {
  if (length <= 0) {
    throw new Error('Length must be a positive integer');
  }
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};
