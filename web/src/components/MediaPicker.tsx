"use client";

import { ChangeEvent, useState } from "react";

export function MediaPicker() {
  const [mediaPreview, setPreview] = useState<string | null>(null);

  function onMediaSelection(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const mediaPreviewUrl = URL.createObjectURL(files[0]);

    setPreview(mediaPreviewUrl);
  }

  return (
    <>
      <input
        type="file"
        name="media"
        id="media"
        className="invisible w-0 h-0"
        onChange={onMediaSelection}
      />

      {mediaPreview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaPreview}
          alt=""
          className="w-full aspect-video rounded-lg object-cover"
        />
      )}
    </>
  );
}
