"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { Check, PauseIcon, PlayIcon, Settings } from "lucide-react";
import { useAnimationFrame as useMotionAnimationFrame } from "motion/react";
import type { ComponentProps, HTMLProps, ReactNode, RefObject } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

enum ReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

enum NetworkState {
  NETWORK_EMPTY = 0,
  NETWORK_IDLE = 1,
  NETWORK_LOADING = 2,
  NETWORK_NO_SOURCE = 3,
}

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMins = mins < 10 ? `0${mins}` : mins;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;

  return hrs > 0
    ? `${hrs}:${formattedMins}:${formattedSecs}`
    : `${mins}:${formattedSecs}`;
};

interface AudioPlayerItem<TData = unknown> {
  id: string | number;
  src: string;
  captions?: {
    src: string;
    srcLang: string;
    label: string;
  };
  data?: TData;
}

interface AudioPlayerApi<TData = unknown> {
  ref: RefObject<HTMLAudioElement | null>;
  activeItem: AudioPlayerItem<TData> | null;
  duration: number | undefined;
  error: MediaError | null;
  isPlaying: boolean;
  isBuffering: boolean;
  playbackRate: number;
  isItemActive: (id: string | number | null) => boolean;
  setActiveItem: (item: AudioPlayerItem<TData> | null) => void;
  play: (item?: AudioPlayerItem<TData> | null) => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerApi<unknown> | null>(null);

const useAudioPlayer = <TData = unknown,>(): AudioPlayerApi<TData> => {
  const api = useContext(AudioPlayerContext) as AudioPlayerApi<TData> | null;
  if (!api) {
    throw new Error(
      "useAudioPlayer cannot be called outside of AudioPlayerProvider"
    );
  }
  return api;
};

const AudioPlayerTimeContext = createContext<number | null>(null);

export const useAudioPlayerTime = () => {
  const time = useContext(AudioPlayerTimeContext);
  if (time === null) {
    throw new Error(
      "useAudioPlayerTime cannot be called outside of AudioPlayerProvider"
    );
  }
  return time;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider = <TData = unknown,>({
  children,
}: AudioPlayerProviderProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const itemRef = useRef<AudioPlayerItem<TData> | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [readyState, setReadyState] = useState<number>(0);
  const [networkState, setNetworkState] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>();
  const [error, setError] = useState<MediaError | null>(null);
  const [selectedItem, setSelectedItem] =
    useState<AudioPlayerItem<TData> | null>(null);
  const [paused, setPaused] = useState(true);
  const [rate, setRate] = useState<number>(1);

  const updateActiveItem = useCallback(
    (item: AudioPlayerItem<TData> | null) => {
      if (!audioRef.current) {
        return;
      }

      if (item?.id === itemRef.current?.id) {
        return;
      }
      itemRef.current = item;
      const currentRate = audioRef.current.playbackRate;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (item === null) {
        audioRef.current.removeAttribute("src");
      } else {
        audioRef.current.src = item.src;
      }
      audioRef.current.load();
      audioRef.current.playbackRate = currentRate;
    },
    []
  );

  const play = useCallback(
    async (item?: AudioPlayerItem<TData> | null) => {
      if (!audioRef.current) {
        return;
      }

      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (playError) {
          console.error("Play promise error:", playError);
        }
      }

      if (item === undefined) {
        const playPromise = audioRef.current.play();
        playPromiseRef.current = playPromise;
        return playPromise;
      }
      if (item?.id === selectedItem?.id) {
        const playPromise = audioRef.current.play();
        playPromiseRef.current = playPromise;
        return playPromise;
      }

      itemRef.current = item;
      const currentRate = audioRef.current.playbackRate;
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      audioRef.current.currentTime = 0;
      if (item === null) {
        audioRef.current.removeAttribute("src");
      } else {
        audioRef.current.src = item.src;
      }
      audioRef.current.load();
      audioRef.current.playbackRate = currentRate;
      const playPromise = audioRef.current.play();
      playPromiseRef.current = playPromise;
      return playPromise;
    },
    [selectedItem]
  );

  const pause = useCallback(async () => {
    if (!audioRef.current) {
      return;
    }

    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch (pauseError) {
        console.error("Failed to finish pending audio playback:", pauseError);
      }
    }

    audioRef.current.pause();
    playPromiseRef.current = null;
  }, []);

  const seek = useCallback((seekTime: number) => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = seekTime;
  }, []);

  const setPlaybackRate = useCallback((playbackRateValue: number) => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.playbackRate = playbackRateValue;
    setRate(playbackRateValue);
  }, []);

  const isItemActive = useCallback(
    (id: string | number | null) => selectedItem?.id === id,
    [selectedItem]
  );

  useMotionAnimationFrame(() => {
    if (audioRef.current) {
      setSelectedItem(itemRef.current);
      setReadyState(audioRef.current.readyState);
      setNetworkState(audioRef.current.networkState);
      setTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setPaused(audioRef.current.paused);
      setError(audioRef.current.error);
      setRate(audioRef.current.playbackRate);
    }
  });

  const isPlaying = !paused;
  const isBuffering =
    readyState < ReadyState.HAVE_FUTURE_DATA &&
    networkState === NetworkState.NETWORK_LOADING;

  const api = useMemo<AudioPlayerApi<TData>>(
    () => ({
      activeItem: selectedItem,
      duration,
      error,
      isBuffering,
      isItemActive,
      isPlaying,
      pause,
      play,
      playbackRate: rate,
      ref: audioRef,
      seek,
      setActiveItem: updateActiveItem,
      setPlaybackRate,
    }),
    [
      audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      selectedItem,
      rate,
      isItemActive,
      updateActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate,
    ]
  );

  return (
    <AudioPlayerContext.Provider value={api as AudioPlayerApi<unknown>}>
      <AudioPlayerTimeContext.Provider value={time}>
        <audio
          ref={audioRef}
          className="hidden"
          crossOrigin="anonymous"
          aria-label="Audio player"
        >
          <track
            kind="captions"
            src={selectedItem?.captions?.src}
            srcLang={selectedItem?.captions?.srcLang ?? "en"}
            label={selectedItem?.captions?.label ?? "Captions"}
          />
        </audio>
        {children}
      </AudioPlayerTimeContext.Provider>
    </AudioPlayerContext.Provider>
  );
};

export const AudioPlayerProgress = ({
  ...otherProps
}: Omit<
  ComponentProps<typeof SliderPrimitive.Root>,
  "min" | "max" | "value"
>) => {
  const player = useAudioPlayer();
  const time = useAudioPlayerTime();
  const wasPlayingRef = useRef(false);

  return (
    <SliderPrimitive.Root
      {...otherProps}
      value={[time]}
      onValueChange={(vals) => {
        player.seek(vals[0]);
        otherProps.onValueChange?.(vals);
      }}
      min={0}
      max={player.duration ?? 0}
      step={otherProps.step || 0.25}
      onPointerDown={(e) => {
        wasPlayingRef.current = player.isPlaying;
        player.pause();
        otherProps.onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        if (wasPlayingRef.current) {
          player.play();
        }
        otherProps.onPointerUp?.(e);
      }}
      className={cn(
        "group/ relative flex h-2 w-full items-center overflow-hidden rounded-full select-none data-disabled:opacity-50",
        otherProps.className
      )}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          if (player.isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        }
        otherProps.onKeyDown?.(e);
      }}
      disabled={
        player.duration === undefined ||
        !Number.isFinite(player.duration) ||
        Number.isNaN(player.duration)
      }
    >
      <SliderPrimitive.Track className="bg-muted relative h-1 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="relative flex h-0 w-0 items-center justify-center opacity-0 group-hover/player:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        data-slot="slider-thumb"
      >
        <div className="bg-foreground absolute size-2 rounded-full" />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
};

export const AudioPlayerTime = ({
  className,
  ...otherProps
}: HTMLProps<HTMLSpanElement>) => {
  const time = useAudioPlayerTime();
  return (
    <span
      {...otherProps}
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
    >
      {formatTime(time)}
    </span>
  );
};

export const AudioPlayerDuration = ({
  className,
  ...otherProps
}: HTMLProps<HTMLSpanElement>) => {
  const player = useAudioPlayer();
  return (
    <span
      {...otherProps}
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
    >
      {player.duration !== null &&
      player.duration !== undefined &&
      !Number.isNaN(player.duration)
        ? formatTime(player.duration)
        : "--:--"}
    </span>
  );
};

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => (
  <output
    className={cn(
      "border-muted border-t-foreground size-3.5 animate-spin rounded-full border-2",
      className
    )}
    aria-label="Loading audio"
  >
    <span className="sr-only">Loading...</span>
  </output>
);

interface PlayButtonProps extends React.ComponentProps<typeof Button> {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  loading?: boolean;
}

const PlayButton = ({
  playing,
  onPlayingChange,
  className,
  onClick,
  loading,
  ...otherProps
}: PlayButtonProps) => (
  <Button
    {...otherProps}
    onClick={(e) => {
      onPlayingChange(!playing);
      onClick?.(e);
    }}
    className={cn("relative", className)}
    aria-label={playing ? "Pause" : "Play"}
    type="button"
  >
    {playing ? (
      <PauseIcon
        className={cn("size-4", loading && "opacity-0")}
        aria-hidden="true"
      />
    ) : (
      <PlayIcon
        className={cn("size-4", loading && "opacity-0")}
        aria-hidden="true"
      />
    )}
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] backdrop-blur-xs">
        <Spinner />
      </div>
    )}
  </Button>
);

export interface AudioPlayerButtonProps<
  TData = unknown,
> extends React.ComponentProps<typeof Button> {
  item?: AudioPlayerItem<TData>;
}

export const AudioPlayerButton = <TData = unknown,>({
  item,
  ...otherProps
}: AudioPlayerButtonProps<TData>) => {
  const player = useAudioPlayer<TData>();

  if (!item) {
    return (
      <PlayButton
        {...otherProps}
        playing={player.isPlaying}
        onPlayingChange={(shouldPlay) => {
          if (shouldPlay) {
            player.play();
          } else {
            player.pause();
          }
        }}
        loading={player.isBuffering && player.isPlaying}
      />
    );
  }

  return (
    <PlayButton
      {...otherProps}
      playing={player.isItemActive(item.id) && player.isPlaying}
      onPlayingChange={(shouldPlay) => {
        if (shouldPlay) {
          player.play(item);
        } else {
          player.pause();
        }
      }}
      loading={
        player.isItemActive(item.id) && player.isBuffering && player.isPlaying
      }
    />
  );
};

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
const DEFAULT_BUTTON_GROUP_SPEEDS = [0.5, 1, 1.5, 2] as const;

export interface AudioPlayerSpeedProps extends React.ComponentProps<
  typeof Button
> {
  speeds?: readonly number[];
}

export const AudioPlayerSpeed = ({
  speeds = PLAYBACK_SPEEDS,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: AudioPlayerSpeedProps) => {
  const player = useAudioPlayer();
  const currentSpeed = player.playbackRate;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(className)}
          aria-label="Playback speed"
          {...props}
        >
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-30">
        {speeds.map((speed) => (
          <DropdownMenuItem
            key={speed}
            onClick={() => player.setPlaybackRate(speed)}
            className="flex items-center justify-between"
          >
            <span className={speed === 1 ? "" : "font-mono"}>
              {speed === 1 ? "Normal" : `${speed}x`}
            </span>
            {currentSpeed === speed && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export interface AudioPlayerSpeedButtonGroupProps extends Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children"
> {
  speeds?: readonly number[];
}

export const AudioPlayerSpeedButtonGroup = ({
  speeds = DEFAULT_BUTTON_GROUP_SPEEDS,
  className,
  ...props
}: AudioPlayerSpeedButtonGroupProps) => {
  const player = useAudioPlayer();
  const currentSpeed = player.playbackRate;

  return (
    <fieldset
      className={cn("flex min-w-0 items-center gap-1 border-0 p-0", className)}
      {...props}
    >
      <legend className="sr-only">Playback speed controls</legend>
      {speeds.map((speed) => {
        const isSelected = currentSpeed === speed;

        return (
          <Button
            key={speed}
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => player.setPlaybackRate(speed)}
            className="min-w-12.5 font-mono text-xs"
            aria-pressed={isSelected}
          >
            {speed}x
          </Button>
        );
      })}
    </fieldset>
  );
};

export const exampleTrack = {
  data: { artist: "Jonathan Coulton", title: "Code Monkey" },
  id: "0",
  src: "/code-monkey.mp3",
};
