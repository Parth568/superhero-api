// models/MarvelCharacter.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const superheroCharacterSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: 'superheroCharacters' // Custom collection name
  }
);

// Create a unique index on 'id' field
// productSchema.index({ id: 1 }, { unique: true });
    
const characters = mongoose.model('characters', superheroCharacterSchema);
  
export default characters;