'use client'
import { useApp } from '../../components/AppStateProvider'
import { channelVideos, findChannel } from '../../hooks/useChannel'
import VideoRow from '../../components/VideoRow'

export default function ChannelPage() {
  const {
    channels,
    videos,
    selectedChannelId,
    isSubscribed,
    viewsFor,
    openChannel,
    openVideo,
    toggleSubscribe,
  } = useApp()
  const channel = findChannel(channels, selectedChannelId)

  if (!channel) {
    return (
      <section data-testid="page-channel">
        <p data-testid="no-channel">No channel selected.</p>
      </section>
    )
  }

  const subscribed = isSubscribed(channel.id)
  const vids = channelVideos(videos, channel.id)

  return (
    <section data-testid="page-channel">
      <h1 data-testid="channel-name">{channel.name}</h1>
      <button data-testid="subscribe-toggle" onClick={() => toggleSubscribe(channel.id)}>
        {subscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
      {subscribed ? <span data-testid="subscriber-flag">Subscribed</span> : null}
      <div data-testid="channel-switcher">
        {channels.map((c) => (
          <button key={c.id} data-testid={`switch-${c.id}`} onClick={() => openChannel(c.id)}>
            {c.name}
          </button>
        ))}
      </div>
      <ul data-testid="channel-videos">
        {vids.map((v) => (
          <VideoRow key={v.id} video={v} views={viewsFor(v.id)} onOpen={openVideo} />
        ))}
      </ul>
    </section>
  )
}
