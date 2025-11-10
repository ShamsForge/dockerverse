import React from "react";

type DockerImage = {
  id: string;
  name: string;
  tags: string[];
};

type ImagesProps = {
  images: DockerImage[];
  onDeleteTag: (imageId: string, tag: string) => void;
};

export default function ImagesTab({ images, onDeleteTag }: ImagesProps) {
  return (
    <section>
      <h4 className="mb-4 text-lg font-medium">Docker Images</h4>
      <div className="space-y-4">
        {images.length === 0 ? (
          <div className="rounded border border-dashed p-8 text-center text-sm text-zinc-500">
            No images available.
          </div>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="rounded border p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            >
              <div className="font-medium mb-2">{img.name}</div>
              <div className="flex flex-wrap gap-2">
                {img.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 rounded-full bg-zinc-200 dark:bg-zinc-700 px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => onDeleteTag(img.id, tag)}
                      className="ml-1 text-xs font-bold hover:text-red-500 transition"
                      aria-label={`Delete tag ${tag}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
