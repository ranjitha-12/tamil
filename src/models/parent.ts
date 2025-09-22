import mongoose from "mongoose";

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  countryCode: string;
}

export interface ParentInterface extends mongoose.Document {
  username?: string;
  whatsapp: string;
  email: string;
  password: string;
  motherFirstName?: string;
  motherLastName?: string;
  fatherFirstName?: string;
  fatherLastName?: string;
  students: mongoose.Types.ObjectId[];
  role: "Parent";
  address?: Address;
  profileImage?: string;
}
const addressSchema = new mongoose.Schema<Address>(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true},
    countryCode: { type: String },
  },
  { _id: false }
);

const parentSchema = new mongoose.Schema<ParentInterface>({
  username: { type: String },
  email: { type: String, required: true, unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
   },
  whatsapp: { type: String, required: true,
    validate: {
        validator: function(v: string) {
          return /^\+\d{1,4}\d{6,}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
   },
  password: { type: String, required: true, minlength: 6, },
  role: { type: String, enum: ["Parent"], default: "Parent", required: true },
  address: addressSchema,
  motherFirstName: { type: String },
  motherLastName: { type: String },
  fatherFirstName: { type: String },
  fatherLastName: { type: String },
  profileImage: { type: String },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

const Parent = mongoose.models.Parent || mongoose.model<ParentInterface>("Parent", parentSchema);
export default Parent;