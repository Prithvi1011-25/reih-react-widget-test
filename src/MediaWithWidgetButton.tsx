import type { ReihMediaItem } from './widgetConfig';

type MediaWithWidgetButtonProps = {
  media: ReihMediaItem;
  alt: string;
  className?: string;
  label: string;
  onOpen: (media?: ReihMediaItem) => void | Promise<void>;
};

export function MediaWithWidgetButton({
  media,
  alt,
  className,
  label,
  onOpen,
}: MediaWithWidgetButtonProps) {
  return (
    <div className="media-frame">
      <img src={media.image_url} alt={alt} className={className} />
      <button
        type="button"
        className="media-frame__fab"
        aria-label={`Reimagine ${label}`}
        onClick={() => onOpen(media)}
      >
        Reimagine
      </button>
    </div>
  );
}
