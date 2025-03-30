export const sendPushNotification = async (
  deviceToken,
  title,
  body,
  data = {}
) => {
  console.log("Simulated notification to:", deviceToken);
  console.log("Title:", title);
  console.log("Body:", body);
  console.log("Data:", data);
  return true; // Simulate successful notification
};
