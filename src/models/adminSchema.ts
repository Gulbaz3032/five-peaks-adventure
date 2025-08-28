import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  orderDate: Date;
  time: string;
  vehicleNumber: string;

  profileImage?: string; // URL or base64 string

  totalPassengers?: number;
  numberOfFemales?: number;
  numberOfMales?: number;

  vehicleWithPassengers: boolean;
  vehicleWithGoods: boolean;

  typeOfGoods: string;
}

const adminSchema: Schema = new Schema({
  orderDate: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  totalPassengers: {
    type: Number,
  },
  numberOfFemales: {
    type: Number,
  },
  numberOfMales: {
    type: Number,
  },
  vehicleWithPassengers: {
    type: Boolean,
    default: false,
  },
  vehicleWithGoods: {
    type: Boolean,
    default: false,
  },
  typeOfGoods: {
    type: String,
    required: true
  },
},
{
    timestamps: true
});

const adminModel = mongoose.model<IAdmin>("Admin", adminSchema);
export default adminModel;
