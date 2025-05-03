import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  lastName?: string;

  @Prop({ required: true, unique: true })
  identification: number;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop()
  phone2?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  managedBy: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
