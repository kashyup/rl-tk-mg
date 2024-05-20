const Document = require('../models/document');
const UserRole = require('../models/userRole');

exports.createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({ title, content });
    await document.save();
    res.status(201).send(document);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.addUserRoleToDocument = async (req, res) => {
  try {
    const { userId, roleId, documentId } = req.body;
    const userRole = new UserRole({ user: userId, role: roleId, documentId });
    await userRole.save();
    await Document.findByIdAndUpdate(
      documentId,
      { $push: { userRoles: userRole._id } },
      { new: true, useFindAndModify: false }
    );
    res.status(201).send(userRole);
  } catch (err) {
    res.status(400).send(err);
  }
};