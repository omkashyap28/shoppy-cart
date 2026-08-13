"use client";

import { Check, Link2, LucideDownload, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Facebook, Mail, Telegram, Whatsapp } from "../icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import QRCodeStyling, { Options } from "qr-code-styling";
import { memo, useEffect, useRef, useState } from "react";
import { getShareLinks } from "@/lib/share";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { cn } from "@/lib/utils";

function ShareModelComponent({
  url,
  productTitle,
}: {
  url: string;
  productTitle: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");

  const share = getShareLinks(`${baseUrl}${url}`, productTitle);

  const socialShare = [
    {
      icon: <Facebook className="size-6" />,
      title: "Facebook",
      className: "bg-[#1877f2]!",
      onClick: () => openLink(share.facebook),
    },
    {
      icon: <Whatsapp className="size-6" />,
      title: "Whatsapp",
      className: "bg-[#25D366]!",
      onClick: () => openLink(share.whatsapp),
    },
    {
      icon: <Mail className="size-6" />,
      title: "Mail",
      className: "bg-[#4285F4]!",
      onClick: () => openLink(share.mail),
    },
    {
      icon: <Telegram className="size-6" />,
      title: "Telegram",
      className: "bg-[#0088CC]!",
      onClick: () => openLink(share.telegram),
    },
  ];

  async function handleCopyLink() {
    if (timerRef.current) clearTimeout(timerRef.current);

    await window.navigator.clipboard.writeText(`${baseUrl}${url}`);
    setIsCopied(true);

    timerRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      (() => setBaseUrl(window.location.origin))();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function openLink(url: string) {
    window.open(`${url}`, "_blank", "noopener,noreferrer");
  }

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Share2 className="size-4" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Product</DialogTitle>
            <DialogDescription>
              Share this product via link or QR.
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex items-center justify-center py-5">
            <GenerateQRCode url={`${baseUrl}${url}`} />
          </div>

          <DialogFooter className="flex-row! gap-3 border-border sm:justify-start">
            {socialShare.map(({ icon, title, className, onClick }) => (
              <Tooltip key={title}>
                <TooltipTrigger
                  onClick={onClick}
                  className={cn(
                    "flex size-10! items-center justify-center rounded-full! text-white!",
                    className
                  )}
                >
                  {icon}
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger
                onClick={handleCopyLink}
                className="flex size-10! items-center justify-center rounded-full! bg-indigo-500! text-white!"
              >
                {isCopied ? (
                  <Check className="size-6" />
                ) : (
                  <Link2 className="size-6" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {isCopied ? "Copied" : "Copy Link"}
              </TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="size-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-none!">
        <DrawerHeader>
          <DrawerTitle>Share Product</DrawerTitle>
          <DrawerDescription>
            Share this product via link or QR.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex items-center justify-center py-5">
          <GenerateQRCode url={`${baseUrl}${url}`} />
        </div>

        <DrawerFooter className="scrollbar-none flex-row! gap-3 overflow-x-auto border-t border-border">
          {socialShare.map(({ icon, title, className, onClick }) => (
            <Button
              key={title}
              onClick={onClick}
              variant="outline"
              className={cn("size-11! rounded-full! text-white!", className)}
            >
              {icon}
            </Button>
          ))}

          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="size-11! rounded-full! bg-indigo-500! text-white!"
          >
            {isCopied ? (
              <Check className="size-7" />
            ) : (
              <Link2 className="size-7" />
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const ShareModel = memo(ShareModelComponent);

function GenerateQRCode({ url }: { url: string }) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [options] = useState<Options>({
    width: isDesktop ? 210 : 240,
    height: isDesktop ? 210 : 240,
    type: "svg",
    data: url,
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "H",
    },
    dotsOptions: {
      color: "#000000",
      type: "dots",
      roundSize: true,
    },
    cornersDotOptions: {
      color: "#432dd7",
      type: "extra-rounded",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#432dd7",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  });
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (() => setQrCode(new QRCodeStyling(options)))();
  }, [options]);

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode?.update(options);
  }, [qrCode, options]);

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      name: "product-qr-code",
      extension: "png",
    });
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={ref}
        className="overflow-hidden rounded-xl border border-border bg-white"
      />
      <Button
        onClick={onDownloadClick}
        variant="outline"
        title="Download QR Code"
      >
        <LucideDownload /> Download QR
      </Button>
    </div>
  );
}
