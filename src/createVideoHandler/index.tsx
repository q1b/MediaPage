import { createSignal as useState, createEffect as useEffect, createSignal, JSX } from "solid-js";

export const createVideoHandler = (videoElement: HTMLVideoElement) => {
	const [isPlaying, setPlayingState] = createSignal<boolean>(false);
	const [progress,setProgess] = createSignal<number>(0);
	const [speed,setSpeed] = createSignal<number>(1);
	const [isMuted,setMutedState] = createSignal<boolean>(false);

	const togglePlay = () => {
		setPlayingState(!isPlaying());
	};

	useEffect(() => {
		isPlaying() ? videoElement.play() : videoElement.pause();
	});
		
	const handleOnTimeUpdate = () => {
		const progress = (videoElement.currentTime / videoElement.duration) * 100;
		setProgess(progress);
	};

	const handleVideoProgress = (event:any) => {
		const manualChange = Number(event.target.value);
		videoElement.currentTime = (videoElement.duration / 100) * manualChange;
		setProgess(manualChange);
	};

	const handleVideoSpeed = (event:any) => {
		const speed = Number(event.target.value);
		videoElement.playbackRate = speed;
		setSpeed(speed);
	};

	const toggleMute = () => {
		setMutedState(!isMuted());
	};

	useEffect(() => {
		isMuted() ? (videoElement.muted = true) : (videoElement.muted = false);
	});

	return {
		isPlaying,
		progress,
		speed,
		isMuted,
		togglePlay,
		handleOnTimeUpdate,
		handleVideoProgress,
		handleVideoSpeed,
		toggleMute,
	};
};
