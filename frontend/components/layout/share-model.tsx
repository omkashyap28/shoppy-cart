"use client";

import { Check, Link2, LucideDownload, Share2 } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
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
import { VariantProps } from "class-variance-authority";

interface ShareModelComponentProps extends VariantProps<typeof buttonVariants> {
  url: string;
  productTitle: string;
  modelTitle?: string;
  modelDescription?: string;
  triggerContent?: React.ReactNode;
  className?: string;
}

function ShareModelComponent({
  url,
  productTitle,
  modelTitle = "Share Product",
  modelDescription = "Share this product via link or QR.",
  triggerContent,
  className,
  variant = "ghost",
  size = "icon",
}: ShareModelComponentProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");

  const fullUrl = `${baseUrl}${url}`;
  const share = getShareLinks(fullUrl, productTitle);

  const socialShare = [
    {
      icon: <Facebook className="size-6" />,
      title: "Facebook",
      className: "bg-[#1877f2]",
      onClick: () => openLink(share.facebook),
    },
    {
      icon: <Whatsapp className="size-6" />,
      title: "Whatsapp",
      className: "bg-[#25D366]",
      onClick: () => openLink(share.whatsapp),
    },
    {
      icon: <Mail className="size-6" />,
      title: "Mail",
      className: "bg-[#4285F4]",
      onClick: () => openLink(share.mail),
    },
    {
      icon: <Telegram className="size-6" />,
      title: "Telegram",
      className: "bg-[#0088CC]",
      onClick: () => openLink(share.telegram),
    },
  ];

  async function handleCopyLink() {
    if (timerRef.current) clearTimeout(timerRef.current);

    await window.navigator.clipboard.writeText(fullUrl);
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

  function openLink(shareUrl: string) {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            {triggerContent || <Share2 className="size-4" />}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{modelTitle}</DialogTitle>
            <DialogDescription>{modelDescription}</DialogDescription>
          </DialogHeader>

          <div className="relative flex items-center justify-center py-5">
            <GenerateQRCode url={fullUrl} />
          </div>

          <DialogFooter className="flex-row gap-3 border-border sm:justify-start">
            {socialShare.map(({ icon, title, className, onClick }) => (
              <Tooltip key={title}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onClick}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90",
                      className
                    )}
                  >
                    {icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex size-10 items-center justify-center rounded-full bg-indigo-500 text-white transition-opacity hover:opacity-90"
                >
                  {isCopied ? (
                    <Check className="size-5" />
                  ) : (
                    <Link2 className="size-5" />
                  )}
                </button>
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
        <Button variant={variant} size={size} className={className}>
          {triggerContent || <Share2 className="size-4" />}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-none">
        <DrawerHeader>
          <DrawerTitle>{modelTitle}</DrawerTitle>
          <DrawerDescription>{modelDescription}</DrawerDescription>
        </DrawerHeader>

        <div className="flex items-center justify-center py-5">
          <GenerateQRCode url={fullUrl} />
        </div>

        <DrawerFooter className="scrollbar-none flex-row gap-3 overflow-x-auto border-t border-border">
          {socialShare.map(({ icon, title, className, onClick }) => (
            <Button
              key={title}
              onClick={onClick}
              variant="outline"
              size="icon"
              className={cn(
                "size-11 shrink-0 rounded-full text-white hover:text-white",
                className
              )}
            >
              {icon}
            </Button>
          ))}

          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="icon"
            className="size-11 shrink-0 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white"
          >
            {isCopied ? (
              <Check className="size-6" />
            ) : (
              <Link2 className="size-6" />
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
  const ref = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const size = isDesktop ? 210 : 240;
    const options: Options = {
      width: size,
      height: size,
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
    };

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(options);
      if (ref.current) {
        ref.current.innerHTML = "";
        qrCodeRef.current.append(ref.current);
      }
    } else {
      qrCodeRef.current.update(options);
    }
  }, [url, isDesktop]);

  const onDownloadClick = () => {
    qrCodeRef.current?.download({
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
        <LucideDownload className="mr-2 size-4" /> Download QR
      </Button>
    </div>
  );
}
