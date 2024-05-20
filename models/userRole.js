const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  userId : { type: String, required: true },  
  user: { type: mongoose.Schema.Types.String, ref: 'User', required: true },
  role: { type: mongoose.Schema.Types.String, ref: 'Role', required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true }
});

module.exports = mongoose.model('UserRole', userRoleSchema);