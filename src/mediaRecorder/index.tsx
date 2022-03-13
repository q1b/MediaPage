import { createSignal, createEffect, createMemo, JSX, Accessor, onCleanup } from "solid-js";

export type ReactMediaRecorderRenderProps = {
	error: string;
	muteAudio: () => void;
	unMuteAudio: () => void;
	startRecording: () => void;
	pauseRecording: () => void;
	resumeRecording: () => void;
	stopRecording: () => void;
	mediaBlobUrl: null | string;
	status: Accessor<StatusMessages>;
	isAudioMuted: boolean;
	previewStream: MediaStream | null;
	previewAudioStream: MediaStream | null;
	clearBlobUrl: () => void;
};

export type ReactMediaRecorderHookProps = {
	audio?: boolean | MediaTrackConstraints;
	video?: boolean | MediaTrackConstraints;
	screen?: boolean;
	onStop?: (blobUrl: string, blob: Blob) => void;
	blobPropertyBag?: BlobPropertyBag;
	mediaRecorderOptions?: MediaRecorderOptions | null;
	askPermissionOnMount?: boolean;
};
export type ReactMediaRecorderProps = ReactMediaRecorderHookProps & {
	render: (props: ReactMediaRecorderRenderProps) => JSX.Element;
};

export type StatusMessages =
	| "media_aborted"
	| "permission_denied"
	| "no_specified_media_found"
	| "media_in_use"
	| "invalid_media_constraints"
	| "no_constraints"
	| "recorder_error"
	| "idle"
	| "acquiring_media"
	| "delayed_start"
	| "recording"
	| "stopping"
	| "stopped"
	| "paused";

export enum RecorderErrors {
	AbortError = "media_aborted",
	NotAllowedError = "permission_denied",
	NotFoundError = "no_specified_media_found",
	NotReadableError = "media_in_use",
	OverconstrainedError = "invalid_media_constraints",
	TypeError = "no_constraints",
	NONE = "",
	NO_RECORDER = "recorder_error",
}

export function useReactMediaRecorder({
	audio = true,
	video = false,
	onStop = () => null,
	blobPropertyBag,
	screen = false,
	mediaRecorderOptions = null,
	askPermissionOnMount = false,
}: ReactMediaRecorderHookProps): ReactMediaRecorderRenderProps {
	const [mediaRecorder, setMediaRecorder] = createSignal<MediaRecorder | undefined>(undefined);
	const [mediaChunks, setMediaChunks] = createSignal<Blob[]>([]);
	const [mediaStream, setMediaStream] = createSignal<MediaStream | undefined>(undefined);
	const [status, setStatus] = createSignal<StatusMessages>("idle");
	const [isAudioMuted, setIsAudioMuted] = createSignal<boolean>(false);
	const [mediaBlobUrl, setMediaBlobUrl] = createSignal<string | undefined>(undefined);
	const [error, setError] = createSignal<keyof typeof RecorderErrors>("NONE");
 
	const getMediaStream = async () => {
		console.log("Running")
		setStatus("acquiring_media");
		const requiredMedia: MediaStreamConstraints = {
			audio: typeof audio === "boolean" ? !!audio : audio,
			video: typeof video === "boolean" ? !!video : video,
		};
		try {
			if (screen) {
				//@ts-ignore
				const stream = (await window.navigator.mediaDevices.getDisplayMedia({
					video: video || true,
				})) as MediaStream;
				stream.getVideoTracks()[0].addEventListener("ended", () => {
					stopRecording();
				});
				if (audio) {
					const audioStream = await window.navigator.mediaDevices.getUserMedia({
						audio,
					});
					audioStream.getAudioTracks().forEach((audioTrack) => stream.addTrack(audioTrack));
				}
				setMediaStream(stream);
			} else {
				const stream = await window.navigator.mediaDevices.getUserMedia(requiredMedia);
				setMediaStream(stream);
			}
			setStatus("idle");
		} catch (error: any) {
			setError(error.name);
			setStatus("idle");
		}
	};
	getMediaStream();
	createEffect(() => {
		if (!window.MediaRecorder) {
			throw new Error("Unsupported Browser");
		}
		if (screen) {
			//@ts-ignore
			if (!window.navigator.mediaDevices.getDisplayMedia) {
				throw new Error("This browser doesn't support screen capturing");
			}
		}
		const checkConstraints = (mediaType: MediaTrackConstraints) => {
			const supportedMediaConstraints = navigator.mediaDevices.getSupportedConstraints();
			const unSupportedConstraints = Object.keys(mediaType).filter(
				(constraint) => !(supportedMediaConstraints as { [key: string]: any })[constraint]
			);

			if (unSupportedConstraints.length > 0) {
				console.error(
					`The constraints ${unSupportedConstraints.join(
						","
					)} doesn't support on this browser. Please check your ReactMediaRecorder component.`
				);
			}
		};

		if (typeof audio === "object") {
			checkConstraints(audio);
		}
		if (typeof video === "object") {
			checkConstraints(video);
		}

		if (mediaRecorderOptions && mediaRecorderOptions.mimeType) {
			if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
				console.error(`The specified MIME type you supplied for MediaRecorder doesn't support this browser`);
			}
		}

		if (mediaStream() && askPermissionOnMount) {
			getMediaStream();
		}

		onCleanup(()=>{
			if (!mediaStream()) {
				const tracks = mediaStream()?.getTracks();
				tracks?.forEach((track) => track.stop());
			}
		})
	}, [audio, screen, video, getMediaStream, mediaRecorderOptions, askPermissionOnMount]);

	// Media Recorder Handlers

	const startRecording = async () => {
		setError("NONE");
		console.log("starting recording",!mediaStream()?.active);
		if (!mediaStream()?.active) {
			await getMediaStream();
		}
		if (mediaStream()) {
			const isStreamEnded = mediaStream()
				?.getTracks()
				.some((track) => track.readyState === "ended");
			if (isStreamEnded) {
				await getMediaStream();
			}
			// User blocked the permissions (getMediaStream errored out)
			if (!mediaStream()?.active) {
				return;
			}
			setMediaRecorder((c) => {
				let stream = mediaStream();
				if (stream instanceof MediaStream ) {
					c = new MediaRecorder(stream);
					c.ondataavailable = onRecordingActive;
					c.onstop = onRecordingStop;
					c.onerror = () => {
						setError("NO_RECORDER");
						setStatus("idle");
					};
					c.start();
				}
				return c;
			});
			setStatus("recording");
		}
	};

	const onRecordingActive = ({ data }: BlobEvent) => {
		mediaChunks().push(data);
	};

	const onRecordingStop = () => {
		const [chunk] = mediaChunks();
		const blobProperty: BlobPropertyBag = Object.assign(
			{ type: chunk.type },
			blobPropertyBag || (video ? { type: "video/mp4" } : { type: "audio/wav" })
		);
		const blob = new Blob(mediaChunks(), blobProperty);
		const url = URL.createObjectURL(blob);
		setStatus("stopped");
		setMediaBlobUrl(url);
		onStop(url, blob);
	};

	const muteAudio = (mute: boolean) => {
		setIsAudioMuted(mute);
		if (mediaStream()) {
			mediaStream()?.getAudioTracks().forEach((audioTrack) => (audioTrack.enabled = !mute));
		}
	};

	const pauseRecording = () => {
		if (mediaRecorder() && mediaRecorder()?.state === "recording") {
			setStatus("paused");
			mediaRecorder()?.pause();
		}
	};
	
	const resumeRecording = () => {
		if (mediaRecorder() && mediaRecorder()?.state === "paused") {
			setStatus("recording");
			mediaRecorder()?.resume();
		}
	};

	const stopRecording = () => {
		if (mediaRecorder()) {
			if (mediaRecorder()?.state !== "inactive") {
				setStatus("stopping");
				mediaRecorder()?.stop();
				mediaStream() && mediaStream()?.getTracks().forEach((track) => track.stop());
				setMediaChunks([]);
			}
		}
	};

	return {
		error: RecorderErrors[error()],
		muteAudio: () => muteAudio(true),
		unMuteAudio: () => muteAudio(false),
		startRecording,
		pauseRecording,
		resumeRecording,
		stopRecording,
		mediaBlobUrl,
		status,
		isAudioMuted,
		mediaStream,
		previewStream: mediaStream() ? new MediaStream(mediaStream()?.getVideoTracks()) : null,
		previewAudioStream: mediaStream() ? new MediaStream(mediaStream()?.getAudioTracks()) : null,
		clearBlobUrl: () => {
			let mediaBlobURL = mediaBlobUrl()
			if (typeof mediaBlobURL === 'string' )
				URL.revokeObjectURL(mediaBlobURL);
			setMediaBlobUrl(undefined);
			setStatus("idle");
			getMediaStream();
		},
	};
}

export const ReactMediaRecorder = (props: ReactMediaRecorderProps) => props.render(useReactMediaRecorder(props));
