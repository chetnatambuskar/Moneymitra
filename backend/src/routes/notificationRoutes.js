const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const {unreadCount, listNotifications, getNotification, markRead} = require('../controllers/notificationController');

router.use(requireAuth);
router.get('/', listNotifications);
router.get('/unread-count', unreadCount); // must stay above '/:id'
router.get('/:id', getNotification);
router.put('/:id/read', markRead);

module.exports = router;