import { Component, createEffect, createSignal, Index, on, onMount } from "solid-js";
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
				{(foldersDetail, index) => {
					let panelRef: HTMLElement;
					const [animationState, setAnimationState] = createSignal<"expanded" | "expanding" | "collapsing" | "collapsed" | "resizing" | "resized" | "adding" | "added" >(
						foldersDetail().isopen ? "expanding" : "collapsed"
					);
					const getHeight = (ele: HTMLElement): number => {
						const rect = ele.getBoundingClientRect();
						for (var i in rect) {
							if (i === "height") {
								return rect[i];
							}
						}
						return 0;
					};
					const [prevHeight,setPrevHeight] = createSignal(0);
					let height: number;
					createEffect(
						on(animationState, () => {
							switch (animationState()) {
								case "expanding":
									panelRef.style.display = "";
									height = getHeight(panelRef);
									panelRef.style.height = `0px`;
									panelRef.style.overflowY = "hidden";
									let expandingAnim = panelRef.animate(
										{
											height: [`${height}px`],
										},
										{
											fill: "forwards",
											duration: 100,
											easing: "ease-out",
										}
									);
									expandingAnim.onfinish = () => {
										expandingAnim.commitStyles();
										panelRef.style.height = `auto`;
										panelRef.style.overflowY = "";
										expandingAnim.cancel();
										setAnimationState("expanded");
									};
									break;
								case "expanded":
									console.log("Animation is ", animationState());
									break;
								case "collapsing":
									panelRef.style.overflowY = "hidden";
									height = getHeight(panelRef);
									let collapsinganim = panelRef.animate(
										{
											height: [`${height}px`, `0px`],
										},
										{
											duration: 100,
											easing: "ease-out",
										}
									);
									collapsinganim.onfinish = () => {
										collapsinganim.commitStyles();
										panelRef.style.display = "none";
										panelRef.style.height = `auto`;
										collapsinganim.cancel();
										setAnimationState("collapsed");
									};
									break;
								case "collapsed":
									console.log("Animation is ", animationState());
									break;
								case "adding":
									console.log("Animation is ", animationState());
									height = getHeight(panelRef);
									if(height === 0){
										panelRef.style.height = `0px`;
									}
									panelRef.style.overflowY = "hidden";
									let addingAnim = panelRef.animate(
										{
											height: [`${prevHeight()}px`,`${height}px`],
										},
										{
											fill: "forwards",
											duration: 100,
											easing: "ease-out",
										}
									);
									addingAnim.onfinish = () => {
										addingAnim.commitStyles();
										panelRef.style.height = `auto`;
										panelRef.style.overflowY = "";
										addingAnim.cancel();
										// setAnimationState("added");
										setAnimationState('expanded')
									};
									break;
								case "added":
									break;
								default:
									break;
							}
						})
					);
					return (
						<div
							//@ts-ignore
							draggable="true"
							onDragStart={(e) => {
								setGrabElement(e.currentTarget);
								e.currentTarget.style.opacity = "0.2";
							}}
							onDragEnd={(e) => {
								setGrabElement(null);
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
									onClick={async (el) => {
										setClicks((c) => c + 1);
										setTimeout(() => {
											setClicks(0);
										}, 150);
										if (clicks() === 2)
											RenamingHandler(el.currentTarget, {
												folderId: foldersDetail().id,
											});
										if (foldersDetail().isopen && animationState() === "expanded") {
											collapseFolder(foldersDetail().id);
											setAnimationState("collapsing");
										} else if (animationState() === "collapsed") {
											expandFolder(foldersDetail().id);
											setAnimationState("expanding");
										}
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
									onClick={(el) => {
										if (!foldersDetail().isopen ) {
											expandFolder(foldersDetail().id);
											setAnimationState("expanding");
										};
										if(( foldersDetail.length === 0 || animationState() === 'expanded' || animationState() === 'added' ) && animationState() !== 'adding')  {
											let height = getHeight(panelRef);
											console.log(height)
											setPrevHeight(height);
											let fileId = addFile(foldersDetail().id, "Files");
											setAnimationState('adding')
											RenamingHandler(null, {
												folderId: foldersDetail().id,
												fileId,
												inisialText: "",
												placeholder: "filename",
											});
										}
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
							<div id="accordian-panel">
								<ul
									class="flex flex-col"
									style={{
										display: "none",
									}}
									ref={(el: HTMLElement) => {
										panelRef = el;
									}}>
									<Index each={foldersDetail().files}>
										{(fileDetails, i) => {
											let fileRef: HTMLLIElement | undefined;
											const [animstate, setAnimState] = createSignal<"adding" | "added" | "removing" | "removed">(
												"added"
											);
											createEffect(() => {
												if(fileRef)
												switch (animstate()) {
													case "adding":

														break;
													case "added":
														
														break;
													case "removing":
														fileRef.style.overflowY = "hidden";
														height = getHeight(fileRef);
														let collapsinganim = fileRef.animate(
															{
																height: [`${height}px`, `0px`],
																padding:['0px'],
																opacity:[0]
															},
															{
																duration: 100,
																easing: "ease-out",
															}
														);
														collapsinganim.onfinish = () => {
															removeFile(foldersDetail().id, fileDetails().id);
															collapsinganim.cancel();
															setAnimState("removed");
														};
														break;
													case "removed":
														break;
													default:
														break;
												}
											});
											return (
												<li
													ref={fileRef}
													class={`flex flex-col ${
														i === foldersDetail().files.length - 1 ? "pt-3 pb-1" : "pt-3"
													}`}>
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
																if (animstate() !== "removing") {
																	setAnimState("removing");
																}
															}}
															id="delete-button-for-file"
															class="hover:text-rose-500 transition-colors hover:scale-105"
														/>
													</div>
												</li>
											);
										}}
									</Index>
								</ul>
							</div>
						</div>
					);
				}}
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
