export const notificationTemplates = {
  otpVerification: (otp) => ({
    title: "OTP Verification for registration on our app.",
    body: `Your one-time OTP is ${otp}. It will expire within 5 minutes.`,
    data: { otp },
  }),

  timeElapsed: (timeElapsed) => ({
    title: "OTP request timeout.",
    body: `An OTP has already been sent to this phone number. Please wait ${Math.ceil(
      60 - timeElapsed
    )} seconds before requesting a new one.`,
    data: { timeRemaining: `${Math.ceil(60 - timeElapsed)}` },
  }),

  welcomeMessage: (username) => ({
    title: "Welcome!",
    body: `Hello ${username}, welcome to our app!`,
    data: { username },
  }),

  dynamicMessage: (title, body) => ({
    title: `${title}`,
    body: `${body}`,
  }),
};
