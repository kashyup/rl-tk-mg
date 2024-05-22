const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({  
  title: { type: String, required: true },
  content: { type: String, required: true },
  userRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' }],
});

module.exports = mongoose.model('Document', documentSchema);