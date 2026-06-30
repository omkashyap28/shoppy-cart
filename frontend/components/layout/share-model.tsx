"use client";

import { Check, Ellipsis, Link2, LucideDownload, Share2 } from "lucide-react";
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
import { useEffect, useRef, useState } from "react";
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

export function ShareModel({
  productUrl,
  productTitle,
}: {
  productUrl: string;
  productTitle: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const share = getShareLinks(productUrl, productTitle);

  async function handleCopyLink() {
    if (timerRef.current) clearTimeout(timerRef.current);

    await window.navigator.clipboard.writeText(productUrl);
    setIsCopied(true);

    timerRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  async function handleNativeShare() {
    await window.navigator.share({
      title: productTitle,
      text: "Hey! checkout this product",
      url: productUrl,
    });
  }

  function openLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
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
            <GenerateQRCode productUrl={productUrl} />
          </div>

          <DialogFooter className="flex-row! gap-3 border-border sm:justify-start">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => openLink(share.facebook)}
                  variant="outline"
                  className="size-10! rounded-full! bg-[#1877f2]! text-white!"
                >
                  <Facebook className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Facebook</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => openLink(share.whatsapp)}
                  variant="outline"
                  className="size-10! rounded-full! bg-[#25D366]! text-white!"
                >
                  <Whatsapp className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Whatsapp</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => openLink(share.mail)}
                  variant="outline"
                  className="size-10! rounded-full! bg-[#4285F4]! text-white!"
                >
                  <Mail className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mail</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => openLink(share.telegram)}
                  variant="outline"
                  className="size-10! rounded-full! bg-[#0088CC]! text-white!"
                >
                  <Telegram className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Telegram</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="size-10! rounded-full! bg-indigo-500! text-white!"
                >
                  {isCopied ? (
                    <Check className="size-6" />
                  ) : (
                    <Link2 className="size-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isCopied ? "Copied" : "Copy Link"}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={handleNativeShare}
                  variant="outline"
                  className="size-10! rounded-full!"
                >
                  <Ellipsis className="size-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More</TooltipContent>
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
          <GenerateQRCode productUrl={productUrl} />
        </div>

        <DrawerFooter className="scrollbar-none flex-row! gap-3 overflow-x-auto border-t border-border">
          <Button
            onClick={() => openLink(share.facebook)}
            variant="outline"
            className="size-11! rounded-full! bg-[#1877f2]! text-white!"
          >
            <Facebook className="size-7" />
          </Button>
          <Button
            onClick={() => openLink(share.whatsapp)}
            variant="outline"
            className="size-11! rounded-full! bg-[#25D366]! text-white!"
          >
            <Whatsapp className="size-7" />
          </Button>
          <Button
            onClick={() => openLink(share.mail)}
            variant="outline"
            className="size-11! rounded-full! bg-[#4285F4]! text-white!"
          >
            <Mail className="size-7" />
          </Button>
          <Button
            onClick={() => openLink(share.telegram)}
            variant="outline"
            className="size-11! rounded-full! bg-[#0088CC]! text-white!"
          >
            <Telegram className="size-7" />
          </Button>
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
          <Button
            onClick={handleNativeShare}
            variant="outline"
            className="size-11! rounded-full!"
          >
            <Ellipsis className="size-7" />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function GenerateQRCode({ productUrl }: { productUrl: string }) {
  const [options] = useState<Options>({
    width: 210,
    height: 210,
    type: "svg",
    data: productUrl,
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
