import mongoose from 'mongoose';

const connectToDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://mateobesednik:modecova8@cluster0.ljhj4tw.mongodb.net/'
    );

    console.log('mongodb is connected');
  } catch (e) {
    console.log(e);
  }
};

export default connectToDB;
