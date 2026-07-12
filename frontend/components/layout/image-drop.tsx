"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldSeparator } from "@/components/ui/field";
import { useDropzone } from "react-dropzone";
import { CloudUpload, ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function ImageDrop({
  fileInputRef,
  handleUpload,
  title,
  disabled,
  className
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUpload: () => void;
  title: string;
  disabled: boolean;
  className?: string;
}) {

  const [dropBox, setDropBox] = useState(false);

  const { getRootProps, getInputProps, open, inputRef } = useDropzone({
    onDrop: (files) => {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        files.forEach((v) => dataTransfer.items.add(v));
        fileInputRef.current.files = dataTransfer.files;
      }
      handleUpload();
      setDropBox(false);
    },
    multiple: true,
    accept: {
      "image/*": [],
    },
    onDragEnter: () => setDropBox(true),
    onDragLeave: () => setDropBox(false),
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className={cn("relative mt-6 w-full gap-2 rounded-xl border-2 border-dashed border-primary p-6", className)}>
      <Card
        {...getRootProps({
          className:
            "dropzone mx-auto border border-primary/40",
        })}
      >
        {dropBox && <DropBoxContainer />}
        <CardHeader>
          <CardTitle className="text-center">{title || "Upload Images"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <ImagePlus className="size-28 opacity-60" />
            <FieldGroup>
              <Field className="text-center">Drag & Drop Images here</Field>
              <FieldSeparator childrenClassName="bg-card!">Or</FieldSeparator>
              <Field>
                <input
                  {...getInputProps()}
                  hidden
                  className="hidden"
                  disabled={disabled}
                  ref={(node) => {
                    inputRef.current = node!;
                    fileInputRef.current = node;
                  }}
                />
                <Button
                disabled={disabled}
                 type="button" onClick={open} className="h-11 w-full">
                  <CloudUpload className="size-5" />
                  Upload Images
                </Button>
              </Field>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DropBoxContainer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-9 flex h-full w-full flex-col items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm">
      <div className="absolute top-6 left-6 h-12 w-12 rounded-tl-2xl border-t-6 border-l-6 border-primary dark:border-white" />

      <div className="absolute top-6 right-6 h-12 w-12 rounded-tr-2xl border-t-6 border-r-6 border-primary dark:border-white" />

      <div className="absolute bottom-6 left-6 h-12 w-12 rounded-bl-2xl border-b-6 border-l-6 border-primary dark:border-white" />

      <div className="absolute right-6 bottom-6 h-12 w-12 rounded-br-2xl border-r-6 border-b-6 border-primary dark:border-white" />
      <div className="text-xl font-semibold tracking-tight text-black text-shadow-lg md:text-3xl dark:text-white">
        Drop files here...
      </div>
    </div>
  );
}
