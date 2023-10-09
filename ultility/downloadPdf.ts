const downloadPdf = async (url: string) => {
  const response = await fetch("/api/generatePdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (response.ok) {
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.pdf";
    link.click();
  } else {
    console.error("Failed to download PDF");
  }
};

export default downloadPdf;
