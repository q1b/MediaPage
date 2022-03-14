import { VideoPreview } from "./VideoPreview";
import { createEffect, createMemo, createSignal, mapArray, createUniqueId, on, onCleanup, onMount, For } from "solid-js";
import { PlayButton } from "./assets/icons/microphone";
// import FileUpload from "./components/FileUpload";
import { RecordView } from "./RecordView";
import type { Component } from "solid-js";
import { RecordAudio } from "./RecordAudio";

import { FileExplorer, RenamingHandler } from "./components/FileExplorer";
import { createNewFolder } from "./components/store/FileExplorer";

const App: Component = () => {
	const mimeType = "audio/webm";

	return (
		<div class="w-full min-h-screen bg-slate-900 flex flex-col">
			<main class="w-full h-full flex flex-col items-start">
				<FoldersPreview />
			</main>
		</div>
	);
};

const FoldersPreview = () => {
	return (
		<section id="Container" class="bg-slate-900">
			<header>
				<div class="flex items-center justify-between px-4 py-2">
					<h1 class="text-white text-2xl font-bold">AI VIDEOS</h1>
					<button
						title="Add Folder"
						onClick={() => {
							let folderId = createNewFolder("newfolder");
							RenamingHandler(null, {
								inisialText: "",
								placeholder: "name of folder",
								folderId,
							});
						}}>
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
							</svg>
						</span>
					</button>
				</div>
			</header>
			<nav class="w-64 h-full">
				<FileExplorer />
			</nav>
		</section>
	);
};
{
	/* <RecordView /> */
}
{
	/* <RecordAudio /> */
}

export default App;

{
	/* <button ref={(el) => (recordRef = el)} onClick={() => {
          console.log("RECORD");
          record();
        }} class="bg-white text-black">
					RECORD
				</button>
				<button ref={(el) => (stopRef = el)} onClick={() => {
          console.log("STOP");
          stop();
        }} class="">
					STOP
				</button> */
}
{
	/* <div ref={(el) => (soundClips = el)} onClick={stop} ></div> */
}
