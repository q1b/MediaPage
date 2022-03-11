import { createEffect, on, createSignal, onMount } from "solid-js";
import { useReactMediaRecorder } from "./mediaRecorder";
import { PlayButton } from "./assets/icons/microphone";

export const RecordAudio = () => {
	const { status, startRecording, stopRecording, mediaBlobUrl, resumeRecording, pauseRecording, clearBlobUrl } = useReactMediaRecorder({
		video: false,
		audio: true,
	});
	return (
		<div class="flex flex-col py-4">
			<p class="text-white uppercase text-xl">{status}</p>
			{/* <PlayButton /> */}
			{mediaBlobUrl() ? <audio src={mediaBlobUrl()} controls autoplay loop /> : null}
			<section class="w-full flex gap-x-4 mt-2">
				<button class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none" onClick={startRecording}>Start Recording</button>
				<button class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none" onClick={pauseRecording}>Pause Recording</button>
				<button class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none" onClick={resumeRecording}>Resume Recording</button>
				<button class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none" onClick={stopRecording}>Stop Recording</button>
				<button class="bg-white hover:scale-105 focus:scale-105 text-slate-900 px-2 py-0.5 transition-transform rounded-lg focus:outline-none" onClick={clearBlobUrl}>Clear Recording</button>
			</section>
		</div>
	);
};
