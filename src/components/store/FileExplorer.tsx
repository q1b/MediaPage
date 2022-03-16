import { createUniqueId as solidUniqueIdGenerator, Accessor, createSignal, Setter } from "solid-js";
import { createStore, produce } from "solid-js/store";

function createUniqueId() {
	return (performance.now().toString(32) + Math.random().toString(32) + solidUniqueIdGenerator()).replace(/\./g, "");
}

export function createLocalStorageSignal<T extends object>(
	key: string
): T extends (...args: never) => unknown ? unknown : [get: Accessor<T>, set: Setter<T>];

export function createLocalStorageSignal<T extends object>(key: string): [Accessor<T>, Setter<T>] {
	const storage = window.localStorage;
	const initialValue: T = JSON.parse(
		storage.getItem(key) ??
			`{"value":{"foldersDetails":[{"id":"1vqpj6cpo020b2hr8k7aocl-0","name":"first Item","isopen":true,"files":[{"id":"1mol0cf1f7n4gr4gcl-1","name":"first file","isactive":false,"index":0}],"index":0}]}}`
	).value;
	const [value, setValue] = createSignal<T>(initialValue);
	const newSetValue = (newValue: T | ((v: T) => T)): T => {
		//@ts-ignore
		const _val: T = typeof newValue === "function" ? newValue(value()) : newValue;
		setValue(_val as any);
		storage.setItem(key, JSON.stringify({ value: _val }));
		return _val;
	};
	return [value, newSetValue as Setter<T>];
}

type VideoTab = {
	id: string;
	fileId:string;
	data:any
}
type audioTab = {
	id:string,
	fileId:string,
	data:any
}
type FileDetails = {
	id?: string;
	folderId:string;
	index: number;
	name: string;
	isactive: boolean;
	isopen: boolean;
};

type FolderDetails = {
	id?: string;
	index: number;
	name: string;
	files: Required<FileDetails>[];
	isopen: boolean;
};

type StoreFolderDetails = {
	readonly id: string;
	readonly name: string;
	readonly index: number;
	readonly files: readonly {
		readonly id: string;
		readonly folderId:string;
		readonly name: string;
		readonly isactive: boolean;
		readonly isopen: boolean;
		readonly index: number;
	}[];
	readonly isopen: boolean;
};

type FoldersStore = {
	readonly foldersDetails: readonly StoreFolderDetails[];
	readonly activeFileDetails: {
		readonly fileId: string;
		readonly folderId: string;
	};
};

export const [get, set] = createLocalStorageSignal<FoldersStore>("lunchAI");

const [store, setStore] = createStore<{
	foldersDetails: Required<FolderDetails>[];
	activeFileDetails: {
		fileId: string;
		folderId: string;
	};
}>(get());

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
	set(store);
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
	set(store);
	return id;
};

export const updateFolderIndex = (folderId: string, newindex: number) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail.id === folderId, "index", newindex);
};

export const renameFolder = (id: string, name: string) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail.id === id, "name", name);
	set(store);
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
	set(store);
};

export const collapseFolder = (folderId: string) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail.id === folderId, "isopen", false);
	set(store);
};

export const expandFolder = (folderId: string) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail.id === folderId, "isopen", true);
	set(store);
};

export const collapseFolderByINDEX = (index: number) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail === store.foldersDetails[index], "isopen", false);
	set(store);
};

export const expandFolderByINDEX = (index: number) => {
	setStore("foldersDetails", (foldersDetail) => foldersDetail === store.foldersDetails[index], "isopen", true);
	set(store);
};

export const addFile = (folderId: string, name: string): string => {
	let id = createUniqueId();
	let isactive = false;
	let isopen = false;
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		produce((files) => {
			files.push({
				id,
				name,
				isactive,
				isopen,
				folderId,
				index: files.length,
			});
		})
	);
	set(store);
	return id;
};

export const setFileState = (folderId: string, fileId: string, state: Partial<{ isopen: boolean; isactive: boolean }> = {}) => {
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		(file) => file.id === fileId,
		"isopen",
		state.isopen || false
	);
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		(file) => file.id === fileId,
		"isactive",
		state.isactive || false
	);
	set(store);
};

export const openFile = (folderId: string, fileId: string) => {
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		(file) => file.id === fileId,
		"isopen",
		true
		// (o) => (o = { ...o, isopen: true, isactive: true })
	);
	focusFile(folderId, fileId);
	set(store);
};

export const blurFile = (folderId: string, fileId: string) => {
	const prevOpenedFile = store.foldersDetails.map((folder) => folder.files.map((e)=> {if(e.isopen) return e} )).flat().filter((e) => e !== undefined);
	const insertHere = prevOpenedFile.findIndex((file)=>file?.id === fileId);
	console.log(prevOpenedFile)
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		(file) => file.id === fileId,
		"isactive",
		false
	);
	// meaning our Item is inbetween not the last one
	if(prevOpenedFile.length !==  insertHere+1){
		// console.log("Inbetween\n",insertHere,prevOpenedFile[insertHere+1],"\n");
		focusFile(prevOpenedFile[insertHere+1]?.folderId,prevOpenedFile[insertHere+1]?.id);
	}else{
		// last item
		focusFile(prevOpenedFile[insertHere-1]?.folderId,prevOpenedFile[insertHere-1]?.id);
	}
	set(store);
};

export const focusFile = (folderId: string, fileId: string) => {
	console.log("Focuing closed file",folderId,fileId);
	if (store.activeFileDetails.folderId) {
		setStore(
			"foldersDetails",
			(foldersDetail) => foldersDetail.id === store.activeFileDetails.folderId,
			"files",
			(file) => file.id === store.activeFileDetails.fileId,
			"isactive",
			false
		);
	}
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		(file) => file.id === fileId,
		"isactive",
		true
	);
	setStore("activeFileDetails", { fileId, folderId });
	set(store);
};

export const closeFile = (folderId: string, fileId: string) => {
	if(store.activeFileDetails.fileId === fileId && store.activeFileDetails.folderId === folderId){
		blurFile(folderId,fileId);
	}
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		(file) => file.id === fileId,
		// (o) => (o = { ...o, isopen: false, isactive: false })
		'isopen',
		false
	);
	set(store);
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
	set(store);
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
	set(store);
};

// in accending order from 0 to 10 like 0,1,2,3...10
export const reorderFolders = () => {
	setStore(
		"foldersDetails",
		produce((folders) => {
			folders.sort((a, b) => a.index - b.index);
		})
	);
};

export const reorderFiles = (folderId: string) => {
	setStore(
		"foldersDetails",
		(foldersDetail) => foldersDetail.id === folderId,
		"files",
		produce((files) => {
			files.sort((a, b) => b.index - a.index);
		})
	);
};

// move a element from kth position to qth position in a array
export const moveElement = (array: any[], k: number, q: number) => {
	const element = array[k];
	array.splice(k, 1);
	array.splice(q, 0, element);
}

export const reAdjustFolders = (folderId:string,newIndex:number) => {
	reorderFolders();
	setStore(
		'foldersDetails',
		(foldersDetail)=>foldersDetail.index === newIndex,
		'index',
		newIndex+1,
	)
	setStore(
		'foldersDetails',
		(foldersDetail)=>foldersDetail.id === folderId,
		'index',
		newIndex,
	)
	for(let index = 0; index < store.foldersDetails.length; index++) {
		const folderDetails = store.foldersDetails[index];
		if(folderDetails.index >= newIndex) {
			setStore(
				"foldersDetails",
				(foldersDetail) => foldersDetail.id === folderId,
				"index",
				(i) => i+1,
			);
			break;
		}
	}
	set(store);
}
