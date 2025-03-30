import admin from "../../../firebase/firebase.js";

/**
 * Sends a push notification using Firebase Cloud Messaging (FCM).
 * @param {string} deviceToken - The recipient's FCM device token.
 * @param {string} title - The title of the notification.
 * @param {string} body - The body of the notification.
 * @param {Object} [data] - Optional additional data to include in the notification.
 * @returns {Promise<boolean>} - Returns true if notification was sent successfully.
 */

export const sendPushNotification = async (
  deviceToken,
  title,
  body,
  data = {}
) => {
  try {
    const message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
      data, // Optional additional payload
    };

    // console.log("Sending push notification:", message);

    // await admin.messaging().send(message);

    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent message:", response);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
    // return true;
  } catch (error) {
    console.error("Error preparing message:", error);
    throw new Error(`Error sending push notification: ${error.message}`);
  }
};
