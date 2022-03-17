import { Component, createSignal, Index, onMount } from "solid-js";
import { InputField, inputValue, setInputValue } from "./core/🌍InputField";
import { AddBtn, DeleteBtn, ReorderBtn } from "./parts/Btns";

import store, {
	addFile,
	collapseFolder,
	expandFolder,
	openFile,
	removeFile,
	removeFolder,
	renameFile,
	renameFolder,
} from "./store/FileExplorer";

function classNames(...classes: (false | null | undefined | string)[]): string {
	return classes.filter(Boolean).join(" ");
}

// https://github.com/WebDevSimplified/Drag-And-Drop/blob/master/script.js
function getDragAfterElement(container: HTMLElement, y: number): Element | undefined {
	const draggableElements = [...container.querySelectorAll("#accordianItem")];
	const element: { offset: number; element?: Element } = draggableElements.reduce(
		(closest, child): { offset: number; element?: Element } => {
			const box = child.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY }
	);
	return element.element;
}
const emptyRenamingState = {
	folderId: "",
	fileId: "",
	inisialText: "",
	placeholder: "",
	dimensions: {
		width: 40,
		height: 10,
		posX: 10,
		posY: 10,
	},
};
const [renamingState, setRenameState] = createSignal<{
	folderId: string;
	inisialText: string;
	fileId: string;
	placeholder: string;
	dimensions: {
		width: number;
		height: number;
		posX: number;
		posY: number;
	};
}>(emptyRenamingState);

export const RenamingHandler = (
	el: HTMLButtonElement | null,
	details: {
		folderId: string;
		fileId?: string;
		inisialText?: string;
		placeholder?: string;
	}
) => {
	let values: DOMRect;
	if (el !== null) {
		values = el.getBoundingClientRect();
	} else if (details.fileId) {
		values = document.getElementById(details.fileId)?.getBoundingClientRect() || new DOMRect();
	} else {
		values = document.getElementById(details.folderId)?.getBoundingClientRect() || new DOMRect();
	}
	const { width, height, x, y } = values;
	console.log(details.placeholder);
	setRenameState({
		folderId: details.folderId,
		fileId: details.fileId || "",
		inisialText: details.inisialText || el?.innerText || "",
		placeholder: details.placeholder || "",
		dimensions: {
			width,
			height,
			posX: x,
			posY: y,
		},
	});
};

export const FileExplorer: Component = () => {
	const [clicks, setClicks] = createSignal<number>(0);
	const [grabedElement, setGrabElement] = createSignal<HTMLElement | null>(null);
	onMount(() => {
		// reAdjustFolders(store.foldersDetails[0].id,1);
	});
	return (
		<main
			onDragOver={(e) => {
				e.preventDefault();
				const afterElement = getDragAfterElement(e.currentTarget, e.clientY);
				// const draggable = document.querySelector(".dragging");
				let draggable = grabedElement();
				if (draggable) {
					if (afterElement == undefined) {
						e.currentTarget.appendChild(draggable);
					} else {
						e.currentTarget.insertBefore(draggable, afterElement);
					}
				}
			}}
			id="accordian"
			class="flex flex-col mt-5 gap-y-3 px-2">
			{renamingState().folderId ? (
				<InputField
					placeholder={renamingState().placeholder || "rename"}
					onDone={() => {
						const { folderId, fileId } = renamingState();
						if (fileId !== "") {
							renameFile(folderId, fileId, inputValue());
						} else renameFolder(folderId, inputValue());
						setRenameState(emptyRenamingState);
					}}
					ref={(el) => {
						const { inisialText, dimensions } = renamingState();
						setInputValue(inisialText);
						// @ts-ignore
						el.parentElement.style.top = `${dimensions.posY}px`;
						// @ts-ignore
						el.parentElement.style.left = `${dimensions.posX + 16}px`;
						// @ts-ignore
						el.parentElement.style.width = `${dimensions.width - 16}px`;
						// @ts-ignore It's defined
						el.parentElement.style.height = `${dimensions.height}px`;
					}}
				/>
			) : null}
			<Index each={store.foldersDetails}>
				{(foldersDetail, index) => (
					<div
						//@ts-ignore
						draggable="true"
						onDragStart={(e) => {
							setGrabElement(e.currentTarget);
							e.currentTarget.style.opacity = "0.2";
						}}
						onDragEnd={(e) => {
							setGrabElement(null);
							// e.currentTarget.parentElement?.childNodes.forEach((j,i)=>{
							// 	if(j === e.currentTarget){
							// 		reAdjustFolders(foldersDetail().id,i);
							// 	}
							// })
							e.currentTarget.style.opacity = "1";
						}}
						id="accordianItem"
						class="flex flex-col">
						<div
							class={classNames(
								foldersDetail().isopen ? "bg-white text-slate-800" : "bg-slate-500 text-slate-100",
								"flex px-2 rounded-lg transition-colors"
							)}>
							<button
								class="w-full font-mono flex items-center"
								// Header
								id={foldersDetail().id}
								onClick={(el) => {
									setClicks((c) => c + 1);
									setTimeout(() => {
										setClicks(0);
									}, 150);
									if (clicks() === 2)
										RenamingHandler(el.currentTarget, {
											folderId: foldersDetail().id,
										});
									!foldersDetail().isopen ? expandFolder(foldersDetail().id) : collapseFolder(foldersDetail().id);
								}}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 transition-transform"
									classList={{
										"rotate-90": foldersDetail().isopen,
										"pr-1": !foldersDetail().isopen,
									}}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
								{foldersDetail().name}
							</button>
							<AddBtn
								title="Add File"
								id=""
								class=""
								onClick={() => {
									let fileId = addFile(foldersDetail().id, "Files");
									if (!foldersDetail().isopen) expandFolder(foldersDetail().id);
									RenamingHandler(null, {
										folderId: foldersDetail().id,
										fileId,
										inisialText: "",
										placeholder: "filename",
									});
								}}
							/>
							<DeleteBtn
								title="DeleteFolder"
								onClick={() => {
									removeFolder(foldersDetail().id);
								}}
								id="delete-for-folder-button"
							/>
							<ReorderBtn title="Reorder" id="" class="cursor-grab" />
						</div>
						{foldersDetail().isopen && foldersDetail().files.length !== 0 ? (
							<div id="accordian-panel">
								<ul class="flex flex-col gap-y-3 mt-3">
									<Index each={foldersDetail().files}>
										{(fileDetails) => (
											<li class="flex flex-col">
												<div
													class={classNames(
														"flex px-2 rounded-lg drop-shadow-sm",
														fileDetails().isactive ? "bg-cyan-500 text-white" : "bg-white text-slate-600"
													)}>
													<button
														class="w-full font-mono flex items-center"
														// Header
														id={fileDetails().id}
														onClick={(el) => {
															openFile(foldersDetail().id, fileDetails().id);
															setClicks((c) => c + 1);
															setTimeout(() => {
																setClicks(0);
															}, 150);
															if (clicks() === 2)
																RenamingHandler(el.currentTarget, {
																	folderId: foldersDetail().id,
																	fileId: fileDetails().id,
																});
														}}>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-4 w-4 pr-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															stroke-width="2">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
															/>
														</svg>
														{fileDetails().name}
													</button>
													<DeleteBtn
														title="DeleteFile"
														onClick={() => {
															removeFile(foldersDetail().id, fileDetails().id);
														}}
														id="delete-button-for-file"
														class="hover:text-rose-500 transition-colors hover:scale-105"
													/>
												</div>
											</li>
										)}
									</Index>
								</ul>
							</div>
						) : null}
					</div>
				)}
			</Index>
			{/* <Switch>
					<For each={FoldersDetails}>
						{(button, index) => (
							<Match when={isCurrent(index() + 1)}>
							</Match>
						)}
					</For>
				</Switch> */}
		</main>
	);
};
