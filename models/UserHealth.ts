import mongoose, { Schema, type Document } from "mongoose"

export interface IUserHealth extends Document {
  email: string
  age: number
  height: number
  weight: number
  lastPeriodDate: Date
  periodDuration: string
  birthControl: string
  moodSwings: string[]
  createdAt: Date
  updatedAt: Date
}

const UserHealthSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    lastPeriodDate: {
      type: Date,
      required: true,
    },
    periodDuration: {
      type: String,
      required: true,
      enum: ["1-3", "4-5", "6-7", "8+"],
    },
    birthControl: {
      type: String,
      required: true,
      enum: ["yes", "no"],
    },
    moodSwings: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => {
          const validValues = ["mild", "moderate", "severe", "none"]
          return v.every((item) => validValues.includes(item))
        },
        message: (props:any) => `${props.value} contains invalid mood swing values!`,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.UserHealth || mongoose.model<IUserHealth>("UserHealth", UserHealthSchema)

