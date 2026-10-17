"use client";

import { useMemo, useState } from "react";
import { saveSeo } from "@/app/actions/admin";
import { mediaSrc } from "@/lib/media-path";

export type SeoPageDraft = {
  path: string;
  label: string;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  ogImage: string;
};

export function SeoBoard({
  sitePages,
  packagePages,
  images,
}: {
  sitePages: SeoPageDraft[];
  packagePages: SeoPageDraft[];
  images: string[];
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return packagePages;
    return packagePages.filter((page) => page.label.toLowerCase().includes(needle) || page.path.toLowerCase().includes(needle));
  }, [packagePages, query]);

  return (
    <div className="space-y-8">
      <SeoGroup title="Site pages" pages={sitePages} images={images} />
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Package pages</h2>
          <label className="text-sm font-semibold">
            Find a package
            <input
              className="input mt-1 w-64"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name or address"
              autoComplete="off"
            />
          </label>
        </div>
        {filtered.length === 0 ? <p className="text-sm text-muted">No package pages match that search.</p> : null}
        {filtered.map((page) => (
          <SeoForm key={page.path} page={page} images={images} />
        ))}
      </section>
    </div>
  );
}

function SeoGroup({ title, pages, images }: { title: string; pages: SeoPageDraft[]; images: string[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {pages.map((page) => (
        <SeoForm key={page.path} page={page} images={images} />
      ))}
    </section>
  );
}

function SeoForm({ page, images }: { page: SeoPageDraft; images: string[] }) {
  const [ogImage, setOgImage] = useState(page.ogImage);
  const [title, setTitle] = useState(page.metaTitle);
  const [details, setDetails] = useState(page.metaDescription);

  return (
    <form action={saveSeo} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">{page.label}</h3>
        <p className="text-sm text-muted">{page.path}</p>
      </div>
      <input type="hidden" name="path" value={page.path} />
      <label className="block text-sm font-semibold">
        Meta title
        <input
          className="input mt-1"
          name="metaTitle"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={255}
          required
          autoComplete="off"
        />
        <span className="mt-1 block text-xs font-normal text-muted">{title.length} / 60 characters is a comfortable search title.</span>
      </label>
      <label className="block text-sm font-semibold">
        Meta keywords
        <input className="input mt-1" name="metaKeywords" defaultValue={page.metaKeywords} autoComplete="off" />
        <span className="mt-1 block text-xs font-normal text-muted">Comma-separated phrases for this page.</span>
      </label>
      <label className="block text-sm font-semibold">
        Meta details
        <textarea
          className="input mt-1 min-h-24 py-2"
          name="metaDescription"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          required
          autoComplete="off"
        />
        <span className="mt-1 block text-xs font-normal text-muted">{details.length} / 160 characters is a comfortable search snippet.</span>
      </label>
      <label className="block text-sm font-semibold">
        OG image
        <input
          className="input mt-1"
          name="ogImage"
          value={ogImage}
          onChange={(event) => setOgImage(event.target.value)}
          maxLength={500}
          autoComplete="off"
          placeholder="/media/image.jpg or a full image address"
        />
      </label>
      {ogImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaSrc(ogImage)} alt="" className="h-28 w-48 rounded-lg object-cover" />
      ) : (
        <p className="text-sm text-muted">No share image yet.</p>
      )}
      {images.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Choose from Media</p>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {images.map((src) => (
              <button
                key={src}
                type="button"
                className={`shrink-0 rounded-lg ring-2 ring-offset-2 ${ogImage === src ? "ring-cyan" : "ring-transparent"}`}
                onClick={() => setOgImage(src)}
                aria-label={`Use ${src} as the share image`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-16 w-24 rounded-lg object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">Upload images in Media, then choose one here.</p>
      )}
      <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
        Save {page.label}
      </button>
    </form>
  );
}
