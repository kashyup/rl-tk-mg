const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Document = require('./models/document');
const common = require("./config/common");
const UserRole = require('./models/userRole');
const JWT_SECRET = common.config()["JWT_SECRET"]

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', async (ws, req) => {
    const token = req.url.split('token=')[1];
    if (!token) {
        ws.close(4001, 'Access Denied');
        return;
    }
    try {
        const verified = jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    ws.close(4001, 'Access token expired');
                }
                ws.close(4001, 'Invalid access token');
            }
        });
        const user = await User.findById(verified.id);
        if (!user) {
            ws.close(4001, 'Access Denied');
            return;
        }

        ws.on('message', async (message) => {
            const userId = user._id
            const { documentId, content } = JSON.parse(message);
            let userRole = await UserRole.findOne( {documentId, userId})
            let document = null
            if(!userRole || !userRole.name.includes("ADMIN","EDITOR")){
                console.log(`User don't have access to edit content`)
                document = await Document.findById(documentId)
            }else{
                document = await Document.findByIdAndUpdate(documentId, { content });
            }
            let newContent = document.content
            let userRoles = document.userRoles
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ documentId, newContent, userRoles }));
                }
            });
        });
    } catch (err) {
        ws.close(4001, 'Invalid Token');
    }
});

module.exports = wss;
