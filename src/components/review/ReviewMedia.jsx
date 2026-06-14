export function YouTubeEmbed({ videoId, title, large = false }) {
  return (
    <figure className="w-full">
      <div className={large ? 'review-video-wrap-large' : 'review-video-wrap'}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {!large && (
        <figcaption className="mt-2 text-white/50 text-base text-center">
          Watch: {title}
        </figcaption>
      )}
    </figure>
  )
}
