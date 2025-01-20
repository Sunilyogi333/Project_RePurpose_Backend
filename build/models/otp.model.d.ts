import { Document } from 'mongoose';
import { IOTP } from '../interfaces/otp.interface';
declare const OTP: import("mongoose").Model<IOTP, {}, {}, {}, Document<unknown, {}, IOTP> & IOTP & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default OTP;
