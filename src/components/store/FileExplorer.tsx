import { createUniqueId } from "solid-js";
import { createStore, produce } from "solid-js/store";

type FileDetails = {
	id?: string;
	name: string;
	isactive: boolean;
	index: number;
};

type FolderDetails = {
	id?: string;
	name: string;
	index: number;
	files: Required<FileDetails>[];
	isopen: boolean;
};

const [store, setStore] = createStore<{ foldersDetails: Required<FolderDetails>[] }>({ foldersDetails: [] });
export default store;
export const createNewFolder = (name: string): string => {
	let id = createUniqueId();
	setStore(
		"foldersDetails",
		produce((foldersDetail) => {
			foldersDetail.push({
				id,
				name,
				isopen: false,
				files: [],
				index: foldersDetail.length,
			});
		})
	);
	return id;
};

export const addFolder = (details: FolderDetails) => {
	let id = createUniqueId();
	setStore(
		"foldersDetails",
		produce((foldersDetail) => {
			foldersDetail.push({
				id,
				...details,
			});
		})
	);
	return id;
};

export const renameFolder = (id: string, name: string) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail.id === id, "name", name);
};

export const removeFolder = (id: string) => {
	setStore(
		"foldersDetails",
		produce((foldersDetail) => {
			foldersDetail.splice(
				foldersDetail.findIndex((i) => i.id === id),
				1
			);
		})
	);
};

export const collapseFolder = (folderId: string) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail.id === folderId, "isopen", false);
};

export const expandFolder = (folderId: string) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail.id === folderId, "isopen", true);
};

export const collapseFolderByINDEX = (index: number) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail === store.foldersDetails[index], "isopen", false);
};

export const expandFolderByINDEX = (index: number) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail === store.foldersDetails[index], "isopen", true);
};

export const addFile = (folderId: string, name: string): string => {
	let id = createUniqueId();
	let isactive = false;
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		produce((files) => {
			files.push({
				id,
				name,
				isactive,
				index: files.length,
			});
		})
	);
	return id;
};

export const renameFile = (folderId: string, fileId: string, name: string) => {
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		(file) => file.id === fileId,
		"name",
		name
	);
};

export const removeFile = (folderId: string, fileId: string) => {
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		produce((files) => {
			files.splice(
				files.findIndex((i) => i.id === fileId),
				1
			);
		})
	);
};
