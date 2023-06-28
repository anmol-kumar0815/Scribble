export const subscribeToReportDownloadChannel = ({
  consumer,
  updateMessage,
  updatePercentage,
  generatePdf,
}) => {
  const userEmail = JSON.parse(localStorage.getItem("userEmail"));
  const reportDownloadSubscription = consumer.subscriptions.create(
    {
      channel: "ReportDownloadChannel",
      pubsub_token: userEmail,
    },
    {
      connected() {
        updateMessage("Connected the Cables...");
        generatePdf();
      },
      received(data) {
        const { message, progress } = data;
        updateMessage(message);
        updatePercentage(progress);
      },
    }
  );

  return reportDownloadSubscription;
};
