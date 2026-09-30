const db = require('../config/db');
const {ok, fail} = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/notifications — NotificationsScreen list.
// MySQL returns JSON columns parsed, MariaDB returns a string - handle both.
const withData = row => {
  let data = row.data;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch (e) { data = null; }
  }
  return {...row, data};
};

// GET /api/notifications/unread-count — for a badge on the bell icon.
const unreadCount = asyncHandler(async (req, res) => {
  const [[row]] = await db.query(
    'SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND is_read = FALSE',
    [req.user.id],
  );
  return ok(res, {count: Number(row.n)});
});

const listNotifications = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
  );
  return ok(res, rows.map(withData));
});

// GET /api/notifications/:id — NotificationDetailScreen.
const getNotification = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
  );
  if (rows.length === 0) return fail(res, 'Notification not found.', 404);
  return ok(res, withData(rows[0]));
});

// PUT /api/notifications/:id/read — mark as read when opened.
const markRead = asyncHandler(async (req, res) => {
  await db.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
  );
  return ok(res, {id: Number(req.params.id), isRead: true});
});

module.exports = {unreadCount, listNotifications, getNotification, markRead};