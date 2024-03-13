import React, { useState, useEffect } from "react";
import "./css/main.scss";
import FileDrop from "react-file-drop";
import DriversPanel from "./components/DrivesPanel";
const fs =
	typeof window.require === "function" ? window.require("fs") : undefined;
var path =
	typeof window.require === "function" ? window.require("path") : undefined;
const distPath = "C:\\";

function App() {
	const [filesList, setFilesList] = useState([]);
	const [currentFileName, setCurrentFileName] = useState("");
	const [currentDistPath, setCurrentDistPath] = useState(distPath);
	const [drives, setDrives] = useState([]);
	const updateFileList = path => {
		if (fs)
			fs.readdir(path || currentDistPath, function(err, dir) {
				setFilesList(dir);
			});
	};

	useEffect(() => {
		updateFileList();
	}, []);

	const handleDrop = (files, event) => {
		console.log(files, event);
		if (fs)
			fs.copyFile(
				files[0].path,
				path.join(currentDistPath, files[0].name),
				err => {
					if (err) throw err;
					updateFileList();
				}
			);
	};

	const handleWindowAction = action => {
		const remote = window.require("electron").remote;
		let w = remote.getCurrentWindow();
		w[action]();
	};

	useEffect(() => {
		updateFileList(currentDistPath);
	}, [currentDistPath, currentFileName]);

	const handleFileSelection = event => {
		if (
			fs
				.lstatSync(path.join(currentDistPath, event.currentTarget.textContent))
				.isFile()
		) {
			setCurrentFileName(path.join(event.currentTarget.textContent));
		} else {
			setCurrentDistPath(
				path.join(currentDistPath, event.currentTarget.textContent)
			);
		}
	};

	const handleDeleteFile = () => {
		fs.unlink(path.join(currentDistPath, currentFileName), err => {
			if (err) throw err;
			setCurrentFileName("");
		});
	};

	const handleBack = () => {
		setCurrentDistPath(path.join(currentDistPath, "/.."));
	};

	const driveClick = event => {
		setCurrentDistPath(event.currentTarget.textContent);
		setCurrentFileName("");
	};

	return (
		<div className="main-body">
			<div className="window-buttons-wrapper">
				<div className="window-handle"></div>
				<div
					className="window-button"
					onClick={() => {
						handleWindowAction("minimize");
					}}
				>
					-
				</div>
				<div
					className="window-button"
					onClick={() => {
						handleWindowAction("close");
					}}
				>
					x
				</div>
			</div>
			<div className="titlebar">Explorer</div>
			<div className="content">
				<DriversPanel
					drives={drives}
					setDrives={setDrives}
					driveClick={driveClick}
				/>
				<div className="files-list-wrapper">
					<div className="file-list-title-wrapper">
						<div onClick={handleBack}>
							{`<`}
						</div>
						<div className="current-dir">{currentDistPath}</div>
					</div>
					<div className="files-list">
						{filesList?.map((item, i) => {
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
				<div id="react-file-drop-demo" className="drop-file-zone">
					<FileDrop onDrop={handleDrop}>Upload file(drag'n'drop)</FileDrop>
				</div>
			</div>
		</div>
	);
}

export default App;
