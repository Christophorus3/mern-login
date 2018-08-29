import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSessionSchema = new Schema({
  userId: {
    type: Number,
    default: -1
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

UserSessionSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8, null))
}

UserSessionSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password)
}


export default mongoose.model('UserSession', UserSessionSchema)
