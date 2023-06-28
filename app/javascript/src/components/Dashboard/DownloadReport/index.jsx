import React, { useEffect, useState } from "react";

import FileSaver from "file-saver";
import { Button } from "neetoui";

import createConsumer from "channels/consumer";
import { subscribeToReportDownloadChannel } from "channels/reportDownloadChannel";
import ProgressBar from "common/ProgressBar";
import TooltipWrapper from "common/TooltipWrapper";
import useDownloadPdf from "hooks/reactQuery/articles/useDownloadPdf";
import useGeneratePdf from "hooks/reactQuery/articles/useGeneratePdf";
import { useProgress } from "stores/downloadReport";

const DownloadReport = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { percentage, updatePercentage, message, updateMessage } =
    useProgress();

  const { mutate: generatePdf } = useGeneratePdf({
    onSuccess: () => null,
    onError: error => logger.error(error),
  });

  const { mutate: downloadPdf } = useDownloadPdf({
    onSuccess: data => {
      FileSaver.saveAs(data.data, "scribble_articles_report.pdf");
      setIsLoading(false);
    },
    onError: error => logger.error(error),
  });

  const consumer = createConsumer();

  const handleDownloadPdf = () => {
    setIsLoading(true);
    downloadPdf();
  };

  useEffect(() => {
    subscribeToReportDownloadChannel({
      consumer,
      updateMessage,
      updatePercentage,
      generatePdf,
    });

    return () => {
      consumer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (percentage === 100) {
      setIsLoading(false);
      updateMessage("Report is ready to be downloaded");
    }
  }, [percentage]);

  return (
    <div className="mx-auto mt-48 w-3/6 space-y-6 rounded-md border-2 p-4 text-center">
      <h1>{message}</h1>
      <ProgressBar progress={percentage} />
      <TooltipWrapper
        content="Please wait PDF is being ready."
        disabled={isLoading}
        position="bottom"
      >
        <Button
          disabled={isLoading}
          label="Download"
          loading={isLoading}
          onClick={() => handleDownloadPdf()}
        />
      </TooltipWrapper>
    </div>
  );
};

export default DownloadReport;
