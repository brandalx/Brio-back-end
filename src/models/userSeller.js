import mongoose from 'mongoose';
const { Schema } = mongoose;

const AdminSchema = new Schema({
  // Остальные поля здесь
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  company: String,
  // Ссылка на ресторан
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant' // Это название модели ресторана
  },
  password:String
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
