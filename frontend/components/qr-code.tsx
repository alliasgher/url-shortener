"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  url: string;
  code: string;
}

export function QRCodeDisplay({ url, code }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 180,
        margin: 2,
        color: {
          dark: "#0D1B2A",
          light: "#FFFFFF",
        },
      });
    }
  }, [show, url]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `snip-${code}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  if (!show) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShow(true)}
        className="gap-1.5"
      >
        <QrCode className="h-3.5 w-3.5" />
        QR Code
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-4">
      <canvas ref={canvasRef} />
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="gap-1.5"
      >
        <Download className="h-3.5 w-3.5" />
        Download PNG
      </Button>
    </div>
  );
}
