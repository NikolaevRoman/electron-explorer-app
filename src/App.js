import React, { useState, useEffect } from "react";
import "./css/main.scss";
import DriversPanel from "./components/DrivesPanel";
var path =
	typeof window.require === "function" ? window.require("path") : undefined;
const distPath = "C:\\";

function App() {
	//states
	const [searchPattern, setSearchPattern] = useState("");
	const [filesList, setFilesList] = useState([]);
	const [currentFileName, setCurrentFileName] = useState("");
	const [currentDistPath, setCurrentDistPath] = useState(distPath);
	const [drives, setDrives] = useState([]);

	//variables
	const displayedList = filesList.filter(item => item.includes(searchPattern))
	
	//#region functions
	const updateFileList = async (path) => {
		const fileList = await window.files.filesList(path || currentDistPath) 
		setFilesList(fileList);
	};

	const handleFileSelection = event => {
		// if (
		// 	fs
		// 		.lstatSync(path.join(currentDistPath, event.currentTarget.textContent))
		// 		.isFile()
		// ) {
		// 	setCurrentFileName(path.join(event.currentTarget.textContent));
		// } else {
		// 	setCurrentDistPath(
		// 		path.join(currentDistPath, event.currentTarget.textContent)
		// 	);
		// }
	};

	const handleDeleteFile = () => {
		// fs.unlink(path.join(currentDistPath, currentFileName), err => {
		// 	if (err) throw err;
		// 	setCurrentFileName("");
		// });
	};

	const handleBack = () => {
		setCurrentDistPath(path.join(currentDistPath, "/.."));
	};

	const driveClick = event => {
		setCurrentDistPath(event.currentTarget.textContent);
		setCurrentFileName("");
	};
	//#endregion

	//#region effects
	useEffect(() => {
		updateFileList();
	}, []);

	useEffect(() => {
		updateFileList(currentDistPath);
	}, [currentDistPath, currentFileName]);
	//#endregion

	return (
		<div className="main-body">
			<div className="content">
				<DriversPanel
					drives={drives}
					setDrives={setDrives}
					driveClick={driveClick}
				/>
				<div className="finder">
					<input type="text" onInput={(e) => {
						setSearchPattern(e.currentTarget.value ?? "");
					}}></input>
				</div>
				<div className="files-list-wrapper">
					<div className="file-list-title-wrapper">
						<div onClick={handleBack}>
							{`<`}
						</div>
						<div className="current-dir">{currentDistPath}</div>
					</div>
					<div className="files-list">
						{displayedList?.map((item, i) => {
							return (
								<div
									className="list-item"
									tabIndex={i}
									onMouseDown={handleFileSelection}
									value={item}
								>
									{item}
								</div>
							);
						})}
					</div>
				</div>
				<div className="file-menu">
					<div className="item">
						Download
					</div>
					<div className="item" onClick={handleDeleteFile}>
						Delete
					</div>
					<div className="item">
						Info
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
